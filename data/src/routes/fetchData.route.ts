import express from 'express';
import FetchDataController from '../controllers/fetchData.controller';

const fetchDataRoute = express.Router();

fetchDataRoute.post('/', FetchDataController.getAllData);

fetchDataRoute.post('/query', FetchDataController.getAllDataForQuery);

fetchDataRoute.post('/info', FetchDataController.getInfo);

export default fetchDataRoute;