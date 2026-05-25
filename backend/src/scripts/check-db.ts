import mongoose, { connect } from '../config/database';

async function main() {
  try {
    await connect();

    console.log(
      JSON.stringify(
        {
          success: true,
          database: {
            connected: mongoose.connection.readyState === 1,
            readyState: mongoose.connection.readyState,
            name: mongoose.connection.name ?? null,
            host: mongoose.connection.host ?? null
          }
        },
        null,
        2
      )
    );
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection check failed');
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect().catch(() => undefined);
  }
}

void main();