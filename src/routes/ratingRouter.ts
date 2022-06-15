import express from 'express';
const ratingRouter = express.Router();
import * as ratingController from '../controllers/ratingController';

ratingRouter.post('/rating/friends', (req, res) => {
  ratingController.getFriends(req, res);
});

ratingRouter.get('/rating/global', (req, res) => {
  ratingController.getGlobal(req, res);
});

ratingRouter.get('/rating/country', (req, res) => {
  ratingController.getCountry(req, res);
});

export default ratingRouter;
