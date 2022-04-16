import express from 'express';
const rankRouter = express.Router();
import * as rankController from '../controllers/rankController';
let __dirname = process.cwd();

rankRouter.post('/friends', (req, res) => {
  rankController.getFriends(req, res);
});

rankRouter.get('/global', (req, res) => {
  rankController.getGlobal(req, res);
});

rankRouter.get('/', function (req, res) {
  res.sendFile(__dirname + '/frontend/leaderboard.html');
});

export default rankRouter;
