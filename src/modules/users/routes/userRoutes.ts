import { Router, Request, Response } from "express";
import { authenticate } from "@middlewares/authMiddleware";

const router = Router();

router.get("/users", authenticate, (req: Request, res: Response) => {
  const userId = req.user?.userId;
  res.status(200).json({ message: `Hello User ${userId}` });
});

export default router;
