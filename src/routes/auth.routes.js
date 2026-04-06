import { Router } from "express";

const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  res.send('User registration endpoint');
});

export default authRouter;