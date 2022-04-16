import axios from 'axios';
import mongoose from 'mongoose';
import schedule from 'node-schedule';
import { inspect } from 'util';
import CONSTANTS from '../config/constants';
import contestRouter from '../routes/contestRouter';
import updateLeaderBoardCron from '../crons/updateLeaderBoardCron';

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
  constructor() {}
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
    const { allContests } = await this.getContestList();
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    let contestIdx = 0,
      nextContest = allContests[0];
    while (allContests[contestIdx + 1].startTime > currentTimestampInSeconds) {
      contestIdx++;
    }
    nextContest = allContests[contestIdx];
    const contestModel = new ContestModel(nextContest);
    await ContestModel.deleteMany({});
    await contestModel.save();
    console.log('updated next contest details to db');
    return nextContest;
  }
  public async getNextContest() {
    const contest = await ContestModel.find({});
    let response = {
      title: contest[0].title,
      titleSlug: contest[0].titleSlug,
      startTime: contest[0].startTime,
      duration: contest[0].duration,
      originStartTime: contest[0].originStartTime,
    };
    return response;
  }
  public async schedule() {
    const contest = await this.getNextContest();
    const startTime = new Date(contest.startTime * 1000);
    const endTime = new Date((contest.startTime + contest.duration) * 1000);
    const currentTime = Date.now();
    if (contest.startTime * 1000 - currentTime <= CONSTANTS.DAY_IN_SECONDS * 1000) {
      schedule.scheduleJob(`${startTime.toString()} contest start`, startTime, this.start);
      schedule.scheduleJob(`${endTime.toString()} contest stop`, endTime, this.stop);
    }
    console.log(`\nContests scheduled list : \n${Object.keys(schedule.scheduledJobs).join('\n')}`);
  }
  private start() {
    console.log(`Contest started at ${Date().toString()}`);
    updateLeaderBoardCron.start();
  }
  private stop() {
    console.log(`Contest stopped at ${Date().toString()}`);
    updateLeaderBoardCron.stop();
  }
}

export default Contest;
