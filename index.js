import express from 'express';
import './src/db/mongo';
import rankRouter from './src/routes/rankRouter';
import CONSTANTS from './src/config/constants';
import contestRouter from './src/routes/contestRouter';
import updateNextContestCron from './src/crons/updateNextContestCron';
import scheduleContestCron from './src/crons/scheduleContestCron';

const app = express();
app.use(express.json());
app.use(rankRouter);
app.use(contestRouter);

updateNextContestCron.start();
scheduleContestCron.start();

app.listen(CONSTANTS.PORT, () => {
  console.log(
    `leeter-board listening on port 3000 at ${new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
    })}`
  );
  // new RotatingProxy().updateProxyList();
});
