import dotenv from "dotenv";

dotenv.config();

export const cookieConfig = {
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none",
  httpOnly: true,
};
