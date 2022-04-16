import cron from 'node-cron';
import CONSTANTS from '../config/constants';
import Contest from '../models/Contest';

class UpdateNextContestCron {
  private updateNextContestCron: cron;
  constructor() {
    const instance = this.constructor['instance'];
    if (instance) return instance;
    this.updateNextContestCron = cron.schedule(
      CONSTANTS.UPDATE_CONTEST_SCHEDULE,
      this.updateNextContest,
      { timezone: 'Asia/Kolkata' }
    );
    this.constructor['instance'] = this;
  }

  private updateNextContest() {
    console.log(
      `\nUpdating next contest at ${new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
      })}`
    );
    const contest = new Contest();
    contest.updateNextContest();
  }

  public start() {
    this.updateNextContestCron.start();
  }
}

const updateNextContestCron = new UpdateNextContestCron();

export default updateNextContestCron;
