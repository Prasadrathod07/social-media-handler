import { createApp } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";

async function main(): Promise<void> {
  await connectDatabase();

  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] listening on port ${env.port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[server] failed to start", err);
  process.exit(1);
});
