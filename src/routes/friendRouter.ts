import express from 'express';
const friendRouter = express.Router();
import * as friendController from '../controllers/friendController';

friendRouter.get('/friends', (req, res) => {
  friendController.someEndpoint(req, res);
});

export default friendRouter;
