import express from 'express';
import CheckConnectionController from '../controllers/checkConnection.controller';

const checkConnectionRoute = express.Router();

checkConnectionRoute.post('/', CheckConnectionController.checkConnection);

export default checkConnectionRoute;