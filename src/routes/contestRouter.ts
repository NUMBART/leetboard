import express from 'express';
const contestRouter = express.Router();
import * as contestController from '../controllers/contestController';

contestRouter.get('/contest', (req, res) => {
  contestController.getLastContest(req, res);
});

export default contestRouter;
