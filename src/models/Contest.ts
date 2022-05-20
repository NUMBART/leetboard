import axios from 'axios';
import mongoose from 'mongoose';
import schedule from 'node-schedule';
import CONSTANTS from '../config/constants';
import UpdateLeaderBoardCron from '../crons/updateLeaderBoardCron';

const ContestModel = mongoose.model('Contest', {
  title: String,
  titleSlug: String,
  startTime: Number,
  duration: Number,
  originStartTime: Number,
});

// TODO : remove duplicated config for proxy
// TODO : add retry for following request and add
class Contest {
  private updateLeaderBoardCron: UpdateLeaderBoardCron;
  static lastScheduled = 0;

  constructor() {
    this.updateLeaderBoardCron = new UpdateLeaderBoardCron(CONSTANTS.LEADERBOARD_UPDATE_SCHEDULE);
  }
  private async getContestList() {
    const options = CONSTANTS.CONTESTS_API_OPTION;
    try {
      const response = await axios(options);
      return response.data.data;
    } catch (e) {
      console.log(e);
    }
  }
  public async updateNextContest() {
    // TODO change to bulk upsert
    const { allContests } = await this.getContestList();
    await ContestModel.deleteMany({});
    await ContestModel.insertMany(allContests);
    console.log('updated next contest details to db');
  }
  public async getNextContest() {
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const contest = await ContestModel.findOne({
      startTime: { $gte: currentTimestampInSeconds },
    }).sort({ startTime: 1 });
    let response = {
      title: contest.title,
      titleSlug: contest.titleSlug,
      startTime: contest.startTime,
      duration: contest.duration,
      originStartTime: contest.originStartTime,
    };
    return response;
  }
  public async getLastContest() {
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const contest = await ContestModel.findOne({
      startTime: { $lte: currentTimestampInSeconds },
    }).sort({ startTime: -1 });
    let response = {
      title: contest.title,
      titleSlug: contest.titleSlug,
      startTime: contest.startTime,
      duration: contest.duration,
      originStartTime: contest.originStartTime,
    };
    return response;
  }
  public async schedule() {
    this.scheduleOngoing();
    const contest = await this.getNextContest();
    const startTime = new Date(contest.startTime * 1000);
    const endTime = new Date((contest.startTime + contest.duration) * 1000);
    const currentTime = Date.now();
    const alreadyScheduled =
      contest.startTime * 1000 - Contest.lastScheduled <= CONSTANTS.DAY_IN_SECONDS * 1000;
    if (
      !alreadyScheduled &&
      contest.startTime * 1000 - currentTime <= CONSTANTS.DAY_IN_SECONDS * 1000
    ) {
      schedule.scheduleJob(
        `${startTime.toString()} contest start`,
        startTime,
        this.start.bind(this)
      );
      schedule.scheduleJob(`${endTime.toString()} contest stop`, endTime, this.stop.bind(this));
      Contest.lastScheduled = currentTime;
    }
    console.log(`\nContests scheduled list : \n${Object.keys(schedule.scheduledJobs).join('\n')}`);
  }
  private async scheduleOngoing() {
    const contest = await this.getLastContest();
    const restartTime = new Date(Date.now() + 10000);
    const endTimeStamp = (contest.startTime + contest.duration) * 1000;
    const endTime = new Date(endTimeStamp);
    const currentTime = Date.now();
    if (Math.abs(endTimeStamp - currentTime) <= contest.duration * 1000) {
      schedule.scheduleJob(
        `${restartTime.toString()} contest start`,
        restartTime,
        this.start.bind(this)
      );
      schedule.scheduleJob(`${endTime.toString()} contest stop`, endTime, this.stop.bind(this));
    }
  }
  private start() {
    console.log(`Contest started at ${Date().toString()}`);
    this.updateLeaderBoardCron.start();
  }
  private stop() {
    console.log(`Contest stopped at ${Date().toString()}`);
    this.updateLeaderBoardCron.stop();
  }
}

export default Contest;
