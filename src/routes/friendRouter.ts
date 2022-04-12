import express from 'express';
const friendRouter = express.Router();
import * as friendController from '../controllers/friendController';

friendRouter.get('/friends', (req, res) => {
  friendController.getFriends(req, res);
});

export default friendRouter;
