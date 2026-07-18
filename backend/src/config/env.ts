import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),

  mongodbUri: required("MONGODB_URI", "mongodb://localhost:27017/social-media-handler"),

  jwtAccessSecret: required("JWT_ACCESS_SECRET", "dev-access-secret"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET", "dev-refresh-secret"),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d",

  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",

  aiServiceBaseUrl: process.env.AI_SERVICE_BASE_URL ?? "http://localhost:8000",
  aiServiceApiKey: process.env.AI_SERVICE_API_KEY ?? "",

  tokenEncryptionKey: process.env.TOKEN_ENCRYPTION_KEY ?? "",
};

export const isProduction = env.nodeEnv === "production";
