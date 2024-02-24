import express from 'express';
import * as orgController from '../controllers/org.controller';
import { ValidateTokenMiddleware } from 'insightdb-common';

const orgRouter = express.Router();

orgRouter.post('/', orgController.createorganisation);
orgRouter.use(ValidateTokenMiddleware)
orgRouter.get('/', orgController.getorganisation);
orgRouter.put('/', orgController.updateorganisation);
orgRouter.delete('/:id', orgController.deleteorganisation);

export default orgRouter;