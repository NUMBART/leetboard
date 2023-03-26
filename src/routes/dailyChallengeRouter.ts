import express from 'express';
const ratingRouter = express.Router();
import * as dailyChallengeController from '../controllers/dailyChallengeController';

ratingRouter.get('/daily-challenge', (req, res) => {
  dailyChallengeController.getDailyChallenge(req, res);
});

export default ratingRouter;
