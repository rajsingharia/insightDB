import express from 'express';
import * as orgController from '../controllers/org.controller';
import { ValidateTokenMiddleware } from '../middlewares/validateToken.middleware';

const orgRouter = express.Router();

orgRouter.post('/', orgController.createOrganization);

orgRouter.use(ValidateTokenMiddleware)
orgRouter.get('/', orgController.getOrganization);
orgRouter.put('/', orgController.updateOrganization);
orgRouter.delete('/:id', orgController.deleteOrganization);

export default orgRouter;