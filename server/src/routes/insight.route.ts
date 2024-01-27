import express from 'express';
import { InsightController } from '../controllers/insight.controller';

const insightRoute = express.Router();

insightRoute.get('/', InsightController.getInsights);

insightRoute.get('/:id', InsightController.getInsightWithId);

insightRoute.delete('/:id', InsightController.deleteInsightWithId);

insightRoute.post('/duplicate/:id', InsightController.duplicateInsightWithId);

insightRoute.post('/', InsightController.addInsight);

insightRoute.patch('/:id', InsightController.updateInsight);

insightRoute.patch('/onLayoutChange/:id', InsightController.updateInsightLayout);

export default insightRoute;