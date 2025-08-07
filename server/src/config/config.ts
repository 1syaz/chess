type Config = {
  PORT: number;
  DEV_ENV: "development" | "production";
  MONGO_URI: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  DEV_CLIENT_URL: string;
  PROD_CLIENT_URL: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_SECRET: string;
  FRONTEND_URL: string;
  PROD_FRONTEND_URL: string;
};

const config: Config = {
  PORT: Number(process.env.PORT) || 3000,
  DEV_ENV: (process.env.DEV_ENV as "production" | "development") || "",
  MONGO_URI: process.env.MONGO_URI || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  DEV_CLIENT_URL: process.env.DEV_CLIENT_URL || "",
  PROD_CLIENT_URL: process.env.PROD_CLIENT_URL || "",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "",
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
  PROD_FRONTEND_URL: process.env.PROD_FRONTEND_URL || "",
};

export default config;
