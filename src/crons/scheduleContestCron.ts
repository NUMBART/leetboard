import cron from 'node-cron';
import CONSTANTS from '../config/constants';
import Contest from '../models/Contest';

class ScheduleContestCron {
  private scheduleContestCron: any;
  constructor() {
    const instance = this.constructor['instance'];
    if (instance) return instance;
    this.scheduleContestCron = cron.schedule(
      CONSTANTS.CONTEST_SCHEDULER_SCHEDULE,
      this.scheduleContest,
      { timezone: 'Asia/Kolkata' }
    );
    this.constructor['instance'] = this;
  }
  private async scheduleContest() {
    console.log(
      `\nUpdating contest schedule at ${new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
      })}`
    );
    const contest = new Contest();
    try {
      await contest.schedule();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  public start() {
    this.scheduleContest();
    this.scheduleContestCron.start();
  }
}

const scheduleContestCron = new ScheduleContestCron();

export default scheduleContestCron;
