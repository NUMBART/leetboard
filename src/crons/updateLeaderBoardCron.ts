import cron from 'node-cron';
import CONSTANTS from '../config/constants';
import LeaderBoard from '../models/LeaderBoard';

class UpdateLeaderBoardCron {
  private updateLeaderBoardCron: any;

  constructor() {
    const instance = this.constructor['instance'];
    if (instance) return instance;
    this.updateLeaderBoardCron = cron.schedule(
      CONSTANTS.LEADERBOARD_UPDATE_SCHEDULE,
      this.updateLeaderBoard
    );
    this.constructor['instance'] = this;
  }

  private updateLeaderBoard() {
    console.log(
      `\nUpdating leader board at ${new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
      })}`
    );
    const url = CONSTANTS.CONTEST_URL;
    const leaderBoard = new LeaderBoard(url);
    leaderBoard.updateLeaderBoard().then(() => {
      console.log('updated leader board');
    });
  }

  public start() {
    this.updateLeaderBoard();
    this.updateLeaderBoardCron.start();
  }
}

const updateLeaderBoardCron = new UpdateLeaderBoardCron();

export default updateLeaderBoardCron;
