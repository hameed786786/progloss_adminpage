const DEFAULT_API_BASE = 'https://progloss-adminpage-xg48.onrender.com';
const API_BASE = (import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE).replace(/\/$/, '');

export function apiUrl(path: string) {
  return `${API_BASE}${path}`;
}

const ACCESS_TOKEN_KEY = 'progloss.accessToken';

function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// Convenience: decode JWT payload to read role claim on the client (no signature verification)
export function getCurrentUserRole(): string | null {
  if (typeof window === 'undefined') return null;
  const token = getAccessToken();
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    // If token contains expiry, ensure it's still valid
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload && payload.exp && typeof payload.exp === 'number' && payload.exp < nowSec) {
      return null;
    }
    return payload?.role ?? null;
  } catch (e) {
    return null;
  }
}

function setAccessToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function clearAccessToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

async function refreshAccessToken() {
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) return null;

  const payload = await res.json().catch(() => null);
  const accessToken = payload?.data?.accessToken;
  if (typeof accessToken === 'string' && accessToken) {
    setAccessToken(accessToken);
    return accessToken;
  }

  return null;
}

function emitLocalUpdate(channel: string, payload: any) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(channel, { detail: payload }));
}

async function apiFetch<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');

  const doFetch = async (accessToken?: string | null) => {
    const requestHeaders = new Headers(headers);
    const token = accessToken ?? getAccessToken();
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }

    return fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: 'include',
      headers: requestHeaders,
    });
  };

  let res = await doFetch();

  if (res.status === 401 && path !== '/api/auth/refresh' && path !== '/api/auth/login' && path !== '/api/auth/register') {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      res = await doFetch(refreshedToken);
    } else {
      clearAccessToken();
    }
  } else if (res.status === 401) {
    clearAccessToken();
  }

  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(payload?.error?.message ?? payload?.error ?? `Request failed: ${res.status}`);
  }

  return payload as { success: boolean; data: T };
}

export async function fetchCustomers() {
  const res = await apiFetch<any[]>('/api/customers');
  return res.data;
}

export async function fetchCustomer(id: string) {
  const res = await apiFetch<any>(`/api/customers/${id}`);
  return res.data;
}

export async function fetchInvoices() {
  const res = await apiFetch<any[]>('/api/invoices');
  return res.data;
}

export async function fetchPlans() {
  const res = await apiFetch<any[]>('/api/plans');
  return res.data;
}

export async function fetchStaff() {
  const res = await apiFetch<any[]>('/api/staff');
  return res.data;
}

export async function saveStaff(staff: Record<string, unknown>) {
  const payload = await apiFetch<any>('/api/staff', {
    method: 'POST',
    body: JSON.stringify(staff),
  });
  const list = await fetchStaff();
  emitLocalUpdate('staff:update', list);
  return payload.data;
}

export async function fetchPayments() {
  const res = await apiFetch<any[]>('/api/payments');
  return res.data;
}

export async function fetchRoles() {
  const res = await apiFetch<any[]>('/api/roles');
  return res.data;
}

export async function fetchRolePermissions(name: string) {
  const res = await apiFetch<Record<string, number[]>>(`/api/roles/${encodeURIComponent(name)}/permissions`);
  return res.data;
}

export async function fetchTickets() {
  const res = await apiFetch<any[]>('/api/tickets');
  return res.data;
}

export async function fetchNotificationTemplates() {
  const res = await apiFetch<any[]>('/api/notification-templates');
  return res.data;
}

export async function fetchExportJobs() {
  const res = await apiFetch<any[]>('/api/export-jobs');
  return res.data;
}

export async function downloadExportJob(id: string, suggestedName?: string) {
  const url = `${API_BASE}/api/export-jobs/${encodeURIComponent(id)}/download`;

  const doFetch = async (accessToken?: string | null) => {
    const headers: Record<string, string> = {};
    const token = accessToken ?? getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const resp = await fetch(url, { method: 'GET', credentials: 'include', headers });
    return resp;
  };

  let res = await doFetch();
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) res = await doFetch(refreshed);
    else throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Download failed: ${res.status} ${text}`);
  }

  const blob = await res.blob();
  // Try to obtain filename from headers
  let filename = suggestedName;
  const cd = res.headers.get('content-disposition') || '';
  const m1 = cd.match(/filename\*=UTF-8''([^;\n]+)/);
  const m2 = cd.match(/filename="([^";]+)"/);
  if (!filename) filename = m1?.[1] ? decodeURIComponent(m1[1]) : m2?.[1] ?? undefined;
  if (!filename) filename = `${id}`;

  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
  return true;
}

export async function createExportJob(payload: { name?: string; template?: string; format?: string; desc?: string }) {
  const res = await apiFetch<any>('/api/export-jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function fetchCreditNotes() {
  const res = await apiFetch<any[]>('/api/credit-notes');
  return res.data;
}

export async function fetchInvoice(id: string) {
  const res = await apiFetch<any>(`/api/invoices/${id}`);
  return res.data;
}

export async function login(email: string, password: string) {
  const payload = await apiFetch<{ accessToken: string; refreshToken: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAccessToken(payload.data.accessToken);
  return payload.data;
}

export async function register(email: string, password: string, name?: string) {
  const payload = await apiFetch<{ accessToken: string; refreshToken: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  setAccessToken(payload.data.accessToken);
  return payload.data;
}

export async function saveRole(role: { name: string; desc?: string; color?: string }) {
  const payload = await apiFetch<any>('/api/roles', {
    method: 'POST',
    body: JSON.stringify(role),
  });
  const list = await fetchRoles();
  emitLocalUpdate('roles:update', list);
  return payload.data;
}

export async function saveRolePermissions(role: string, matrix: Record<string, number[]>) {
  const payload = await apiFetch<any>(`/api/roles/${encodeURIComponent(role)}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ matrix }),
  });
  const list = await fetchRoles();
  emitLocalUpdate('roles:update', list);
  return payload.data;
}

export async function deleteRole(role: string) {
  await apiFetch<void>(`/api/roles/${encodeURIComponent(role)}`, {
    method: 'DELETE',
  });
  const list = await fetchRoles();
  emitLocalUpdate('roles:update', list);
}

export async function savePlan(plan: any) {
  const payload = await apiFetch<any>('/api/plans', {
    method: 'POST',
    body: JSON.stringify(plan),
  });
  const list = await fetchPlans();
  emitLocalUpdate('plans:update', list);
  return payload.data;
}

export async function updatePlan(id: string, plan: any) {
  const payload = await apiFetch<any>(`/api/plans/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(plan),
  });
  const list = await fetchPlans();
  emitLocalUpdate('plans:update', list);
  return payload.data;
}

export async function deletePlan(id: string) {
  await apiFetch<void>(`/api/plans/${encodeURIComponent(id)}`, { method: 'DELETE' });
  const list = await fetchPlans();
  emitLocalUpdate('plans:update', list);
}
