import { Router, Request, Response, NextFunction } from "express";
import { login, logout } from "../controllers/authController";
import { csrfProtection } from "@config/csrfConfig";

const router = Router();

router.post(
  "/login",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(`[AuthRoutes] POST /login`);
    next();
  },
  csrfProtection,
  login
);

router.post(
  "/logout",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(`[AuthRoutes] POST /logout`);
    next();
  },
  logout
);

export default router;
