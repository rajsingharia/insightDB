import express from 'express';
import * as alertController from '../controllers/alert.controller';

const alertRouter = express.Router();

alertRouter.get('/', alertController.getAlerts);

alertRouter.post('/', alertController.addAlerts);

alertRouter.put('/', alertController.updateAlert);

alertRouter.delete('/', alertController.deleteAlert);

alertRouter.get('/alertTriggered/', alertController.getAllAlertTriggers);

alertRouter.get('/alertTriggered/:id', alertController.getAlertTriggers);

export default alertRouter;