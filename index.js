import express from 'express';
import './src/db/mongo';
import updateLeaderBoardCron from './src/crons/updateLeaderBoardCron';
import friendRouter from './src/routes/friendRouter';
import CONSTANTS from './src/config/constants';
import contestRouter from './src/routes/contestRouter';

const app = express();
app.use(express.json());
app.use(friendRouter);
app.use(contestRouter);

updateLeaderBoardCron.start();

app.listen(CONSTANTS.PORT, () => {
  console.log(
    `leeter-board listening on port 3000 at ${new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
    })}`
  );
  // new RotatingProxy().updateProxyList();
});
