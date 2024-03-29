import express from 'express';
import * as userController from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.get('/', userController.getUser);
userRouter.put('/', userController.updateUser);
userRouter.delete('/', userController.deleteUser);
userRouter.get('/all', userController.getAllUsersOfOrganization)

export default userRouter;