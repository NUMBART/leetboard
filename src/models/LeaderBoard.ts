import axios from 'axios';
import retry from 'retry';
import CONSTANTS from '../config/constants';
import Contestant from './Contestant';
import Question from './Question';

class LeaderBoard {
  private url: string;
  private options: any;
  private leaderBoard: [];
  private questions: {};

  constructor(url: string) {
    this.url = url;
    this.leaderBoard = [];
    this.options = {
      baseURL: this.url,
      params: {
        region: 'global',
      },
      proxy: {
        protocol: CONSTANTS.PROXY.PROTOCOL,
        host: CONSTANTS.PROXY.HOST,
        port: CONSTANTS.PROXY.PORT,
        auth: {
          username: CONSTANTS.PROXY.AUTH.USERNAME,
          password: CONSTANTS.PROXY.AUTH.PASSWORD,
        },
      },
    };
  }
  async getRankPage(page: number): Promise<any> {
    const options = this.options;
    options.params.pagination = page;
    return new Promise(async (resolve, reject) => {
      const operation = retry.operation({
        retries: 2,
        factor: 1,
        minTimeout: CONSTANTS.RETRY_DELAY,
        maxTimeout: CONSTANTS.RETRY_DELAY,
        randomize: false,
      });
      operation.attempt(async (currentAttempt: number) => {
        try {
          const response = await axios(options);
          resolve(response.data);
        } catch (e) {
          if (operation.retry(e)) {
            console.log(`Error at attempt ${currentAttempt}: ${JSON.stringify(e, null, 2)}`);
            return;
          }
          console.log(`All attempts failed, error : ${JSON.stringify(e, null, 2)}`);
          reject(e);
        }
      });
    });
  }
  private async getContestantCount(): Promise<number> {
    const { user_num: contestantCount } = await this.getRankPage(1);
    return contestantCount;
  }
  private async saveQuestions() {
    try {
      const { questions } = await this.getRankPage(1);
      this.questions = {};
      questions.forEach((q) => (this.questions[`${q.question_id}`] = q));
      await Question.remove({});
      await Question.insertMany(questions);
    } catch (e) {
      console.log(e);
    }
  }
  private getPageBatches(pageCount: number): number[][] {
    let batches = [];
    for (let i = 1; i <= pageCount; i += CONSTANTS.REQUESTS_PER_BATCH) {
      const batchPageCount = Math.min(i + CONSTANTS.REQUESTS_PER_BATCH - 1, pageCount) - i + 1;
      batches.push([...Array(batchPageCount).keys()].map((pg) => pg + i));
    }
    return batches;
  }
  private async getLeaderBoard(batches: number[][]): Promise<any> {
    const leaderBoard = [];
    for (const batch of batches) {
      const ranks = await this.getRankPagesIn(batch);
      ranks.forEach((rank: any) => {
        leaderBoard.push(rank.value);
      });
      await this.delayBetweenBatches();
    }
    return leaderBoard;
  }
  private async delayBetweenBatches() {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('time completed');
      }, CONSTANTS.BATCH_WAIT_TIME);
    });
  }
  private async getRankPagesIn(batch: number[]) {
    return await Promise.allSettled(
      batch.map(async (page) => {
        const response = await this.getRankPage(page);
        return response;
      })
    );
  }
  private async saveLeaderBoard(result: any) {
    const contestants = [];
    result.forEach((rankPage: any) => {
      rankPage.total_rank.forEach((contestant: any, i: any) => {
        delete contestant.contest_id;
        delete contestant.global_ranking;
        delete contestant.data_region;
        contestant.submissions = {};
        Object.entries(rankPage.submissions[i]).forEach((entry) => {
          const [key, value] = entry;
          const id = this.questions[`${key}`].id;
          contestant.submissions[`${id}`] = {
            date: (value as any).date,
            question_id: (value as any).question_id,
            submission_id: (value as any).submission_id,
            fail_count: (value as any).fail_count,
          };
        });
        contestants.push(contestant);
      });
    });
    console.log('sample contestant : ', contestants[0].username);
    try {
      const start = Date.now();
      await Contestant.remove({});
      await Contestant.insertMany(contestants);
      console.log(`Contestants inserted in ${Date.now() - start} ms`);
    } catch (e) {
      console.log(e);
    }
  }
  public async updateLeaderBoard() {
    await this.saveQuestions();
    const contestantCount: number = await this.getContestantCount();
    const pageCount = Math.ceil(contestantCount / CONSTANTS.RANKS_PER_PAGE);
    const batches = this.getPageBatches(pageCount);
    const start = Date.now();
    const result = await this.getLeaderBoard(batches);
    await this.saveLeaderBoard(result);
    const timeTaken = Date.now() - start;
    console.log(`time taken : ${timeTaken} \n result size and object : ${result.length} \n`);
    return { pageCount, contestantCount };
  }
  public async getFriendsRank(friends: string[]) {
    const friendsRankList = await Contestant.find({ username: { $in: friends } });
    return friendsRankList;
  }
  public async getGlobalRank(page: any) {
    const friendsRankList = await Contestant.find({
      rank: { $gt: 50 * (page - 1), $lt: 50 * page + 1 },
    });
    return friendsRankList;
  }
}

export default LeaderBoard;
