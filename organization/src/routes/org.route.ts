import express from 'express';
import * as orgController from '../controllers/org.controller';
import { ValidateTokenMiddleware } from 'insightdb-common';

const orgRouter = express.Router();

orgRouter.post('/', orgController.createOrganisation);
orgRouter.use(ValidateTokenMiddleware)
orgRouter.get('/', orgController.getOrganisation);
orgRouter.put('/', orgController.updateOrganisation);
orgRouter.delete('/:id', orgController.deleteOrganisation);

export default orgRouter;