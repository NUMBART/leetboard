import axios from 'axios';
import CONSTANTS from '../config/constants';
import mongoose from 'mongoose';

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
  public async getNextContest() {
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
    return nextContest;
  }
}

export default Contest;
