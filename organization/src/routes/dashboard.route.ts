import express from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const dashboardRoute = express.Router();

dashboardRoute.get('/default', DashboardController.getDefaultDashboard);

dashboardRoute.get('/all', DashboardController.getAllDashboards);

dashboardRoute.post('/', DashboardController.createDashboard);

dashboardRoute.post('/makeDefault', DashboardController.makeDashboardDefault);

dashboardRoute.post('/addWritePermission/:id', DashboardController.addUserForWritePermission)

export default dashboardRoute;