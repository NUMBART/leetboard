import cron from 'node-cron';
import CONSTANTS from '../config/constants';
import Contest from '../models/Contest';
import ContestLeaderBoard from '../models/ContestLeaderBoard';

class UpdateLeaderBoardCron {
  private updateLeaderBoardCron: any;
  private static shouldUpdate: boolean = true;

  constructor(updateSchedule: string) {
    this.updateLeaderBoardCron = cron.schedule(updateSchedule, this.updateLeaderBoard, {
      timezone: 'Asia/Kolkata',
    });
    this.updateLeaderBoardCron.stop();
  }

  private async updateLeaderBoard() {
    if (UpdateLeaderBoardCron.shouldUpdate === true) {
      UpdateLeaderBoardCron.shouldUpdate = false;
      console.log(
        `\nUpdating leader board at ${new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
        })}`
      );
      try {
        const contest = new Contest();
        const { titleSlug } = await contest.getLastContest();
        const url = CONSTANTS.CONTEST_URL + titleSlug + '/';
        const leaderBoard = new ContestLeaderBoard(url);
        leaderBoard.updateLeaderBoard().then(() => {
          console.log('updated leader board');
          UpdateLeaderBoardCron.shouldUpdate = true;
        });
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }

  public start() {
    this.updateLeaderBoardCron.start();
  }
  public stop() {
    this.updateLeaderBoardCron.stop();
  }
}

export default UpdateLeaderBoardCron;
