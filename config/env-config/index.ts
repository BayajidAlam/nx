interface EnvConfig {
  siteUrl: string;
  backendUrl: string;
  socketUrl: string;
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const envConfig: EnvConfig = {
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000",

  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "",
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
};
