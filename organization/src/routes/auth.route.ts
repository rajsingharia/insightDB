import express from 'express';
import { AuthController } from '../controllers/auth.controller';

const authRouter = express.Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.post('/refresh-token', AuthController.refreshToken);

export default authRouter;
