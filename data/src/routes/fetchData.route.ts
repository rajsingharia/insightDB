import express from 'express';
import FetchDataController from '../controllers/fetchData.controller';

const fetchDataRoute = express.Router();

fetchDataRoute.post('/', FetchDataController.getAllData);

export default fetchDataRoute;