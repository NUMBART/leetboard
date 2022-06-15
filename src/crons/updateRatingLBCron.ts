import cron from 'node-cron';
import CONSTANTS from '../config/constants';
import Contest from '../models/Contest';
import RatingLeaderBoard from '../models/RatingLeaderBoard';

class UpdateRatingLBCron {
  private updateRatingLBCron: any;
  private static shouldUpdate: boolean = true;
  constructor() {
    const instance = this.constructor['instance'];
    if (instance) return instance;
    this.updateRatingLBCron = cron.schedule(
      CONSTANTS.UPDATE_RATING_LB_SCHEDULE,
      this.updateRatingLB,
      { timezone: 'Asia/Kolkata' }
    );
    this.updateRatingLBCron.stop();
    this.constructor['instance'] = this;
  }
  private async updateRatingLB() {
    if (UpdateRatingLBCron.shouldUpdate === true) {
      UpdateRatingLBCron.shouldUpdate = false;
      console.log(
        `\nUpdating rating leaderboard at ${new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
        })}`
      );
      const ratingBoard = new RatingLeaderBoard(CONSTANTS.RATING_LB_URL);
      ratingBoard.updateLeaderBoard().then(() => {
        console.log('updated rating leaderboard');
        UpdateRatingLBCron.shouldUpdate = true;
      });
    }
  }
  public start() {
    this.updateRatingLBCron.start();
  }
}

const updateRatingLBCron = new UpdateRatingLBCron();

export default updateRatingLBCron;
