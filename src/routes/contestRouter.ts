import express from 'express';
const contestRouter = express.Router();
import * as contestController from '../controllers/contestController';

contestRouter.get('/contest', (req, res) => {
  contestController.getNextContest(req, res);
});

export default contestRouter;
