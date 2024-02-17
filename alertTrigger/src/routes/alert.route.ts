import express from 'express';
import * as alertController from '../controllers/alert.controller';

const alertRouter = express.Router();

alertRouter.get('/', alertController.getAllAlertTriggers);

alertRouter.get('/:id', alertController.getAlertTriggers);

export default alertRouter;