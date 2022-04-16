import express from 'express';
const rankRouter = express.Router();
import * as rankController from '../controllers/rankController';
// import html from '../../frontend/leaderboard.html';

rankRouter.post('/friends', (req, res) => {
  rankController.getFriends(req, res);
});

rankRouter.get('/global', (req, res) => {
  rankController.getGlobal(req, res);
});

// rankRouter.get('/g1', (req, res) => {
//   res.send('requi');
// });

rankRouter.get('/', function (req, res) {
  res.sendFile('/Users/subhrangshu/Documents/Nodejs/leetboard/frontend/leaderboard.html');
});

export default rankRouter;
