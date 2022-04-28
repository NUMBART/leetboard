import cron from 'node-cron';
import CONSTANTS from '../config/constants';
import Contest from '../models/Contest';
import LeaderBoard from '../models/LeaderBoard';

class UpdateLeaderBoardCron {
  private updateLeaderBoardCron: any;

  constructor() {
    const instance = this.constructor['instance'];
    if (instance) return instance;
    this.updateLeaderBoardCron = cron.schedule(
      CONSTANTS.LEADERBOARD_UPDATE_SCHEDULE,
      this.updateLeaderBoard,
      { timezone: 'Asia/Kolkata' }
    );
    this.updateLeaderBoardCron.stop();
    this.constructor['instance'] = this;
  }

  private async updateLeaderBoard() {
    console.log(
      `\nUpdating leader board at ${new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
      })}`
    );
    const contest = new Contest();
    const { titleSlug } = await contest.getLastContest();
    const url = CONSTANTS.CONTEST_URL + titleSlug + '/';
    const leaderBoard = new LeaderBoard(url);
    leaderBoard.updateLeaderBoard().then(() => {
      console.log('updated leader board');
    });
  }

  public start() {
    this.updateLeaderBoard();
    this.updateLeaderBoardCron.start();
  }
  public stop() {
    this.updateLeaderBoardCron.stop();
  }
}

const updateLeaderBoardCron = new UpdateLeaderBoardCron();

export default updateLeaderBoardCron;
