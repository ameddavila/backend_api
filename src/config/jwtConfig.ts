import dotenv from "dotenv";

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET!,
  refreshSecret: process.env.JWT_REFRESH_SECRET!,
  accessExpiration: process.env.JWT_ACCESS_EXPIRATION || "15m",
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || "7d",
};
