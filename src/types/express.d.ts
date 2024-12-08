import "express";

declare module "express" {
  export interface Request {
    csrfToken: () => string; // Define que csrfToken siempre es una función
    user?: {
      userId: string;
    };
  }
}
