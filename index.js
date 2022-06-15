import 'dotenv/config';
import express from 'express';
import './src/db/mongo';
import rankRouter from './src/routes/rankRouter';
import CONSTANTS from './src/config/constants';
import contestRouter from './src/routes/contestRouter';
import updateNextContestCron from './src/crons/updateNextContestCron';
import scheduleContestCron from './src/crons/scheduleContestCron';
import UpdateLeaderBoardCron from './src/crons/updateLeaderBoardCron';
import ratingRouter from './src/routes/ratingRouter';
import updateRatingLBCron from './src/crons/updateRatingLBCron';

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(rankRouter);
app.use(ratingRouter);
app.use(contestRouter);

updateNextContestCron.start();
scheduleContestCron.start();
updateRatingLBCron.start();
new UpdateLeaderBoardCron(CONSTANTS.DAILY_LEADERBOARD_UPDATE_SCHEDULE).start();

app.listen(process.env.PORT || CONSTANTS.PORT, () => {
  console.log(
    `leeter-board listening on port ${
      process.env.PORT || CONSTANTS.PORT
    } at ${new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
    })}`
  );
  // new RotatingProxy().updateProxyList();
});
