
import express from 'express';
import FetchDataController from '../controllers/fetchData.controller';

const fetchDataRouteSSE = express.Router();

fetchDataRouteSSE.get('/sse/:insightId', FetchDataController.getAllDataSSE); // Server Sent Events

export default fetchDataRouteSSE;