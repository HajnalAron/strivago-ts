declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string;
      NODE_ENV: "development" | "production";
      PORT?: string;
      MONGO_CONNECTION: string;
      encryptionKey: string;
      GOOGLE_OAUTH_ID: string;
      GOOGLE_OAUTH_SECRET: string;
      API_URL: string;
    }
  }
}

export {};
