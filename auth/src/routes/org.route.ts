import express from 'express';
import * as orgController from '../controllers/org.controller';

const userRouter = express.Router();

userRouter.get('/', orgController.getOrganization);

userRouter.post('/', orgController.createOrganization);

userRouter.put('/', orgController.updateOrganization);

userRouter.delete('/:id', orgController.deleteOrganization);

export default userRouter;