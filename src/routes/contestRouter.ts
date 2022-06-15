import express from 'express';
import CONSTANTS from '../config/constants';
const contestRouter = express.Router();
import * as contestController from '../controllers/contestController';
import RatingLeaderBoard from '../models/RatingLeaderBoard';

contestRouter.get('/contest', (req, res) => {
  contestController.getLastContest(req, res);
});

// contestRouter.get('/test', (req, res) => {
//   const ratingBoard = new RatingLeaderBoard(CONSTANTS.RATING_LB_URL);
//   ratingBoard.updateLeaderBoard();
//   res.send({ data: 'value' });
// });

export default contestRouter;
