import axios from 'axios';
import retry from 'retry';
import CONSTANTS from '../config/constants';
import Contestant from './Contestant';
import Question from './Question';

class LeaderBoard {
  protected url: string;
  protected options: any;
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
          username: CONSTANTS.PROXY.AUTH.username,
          password: CONSTANTS.PROXY.AUTH.password,
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
  protected async getContestantCount(): Promise<number> {
    try {
      const { user_num: contestantCount } = await this.getRankPage(1);
      return contestantCount;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  private async saveQuestions() {
    try {
      const { questions } = await this.getRankPage(1);
      this.questions = {};
      questions.forEach((q) => (this.questions[`${q.question_id}`] = q));
      await Question.remove({});
      await Question.insertMany(questions);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  protected getPageBatches(pageCount: number): number[][] {
    let batches = [];
    for (let i = 1; i <= pageCount; i += CONSTANTS.REQUESTS_PER_BATCH) {
      const batchPageCount = Math.min(i + CONSTANTS.REQUESTS_PER_BATCH - 1, pageCount) - i + 1;
      batches.push([...Array(batchPageCount).keys()].map((pg) => pg + i));
    }
    return batches;
  }
  protected async getLeaderBoard(batches: number[][]): Promise<any> {
    try {
      const leaderBoard = [];
      for (const batch of batches) {
        const ranks = await this.getRankPagesIn(batch);
        ranks.forEach((rank: any) => {
          leaderBoard.push(rank.value);
        });
        await this.delayBetweenBatches();
      }
      return leaderBoard;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  private async delayBetweenBatches() {
    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('time completed');
        }, CONSTANTS.BATCH_WAIT_TIME);
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  protected async getRankPagesIn(batch: number[]) {
    try {
      return await Promise.allSettled(
        batch.map(async (page) => {
          const response = await this.getRankPage(page);
          return response;
        })
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  protected async saveLeaderBoard(result: any) {
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
      console.error(e);
      throw e;
    }
  }
  public async updateLeaderBoard() {
    try {
      await this.saveQuestions();
      const contestantCount: number = await this.getContestantCount();
      const pageCount = Math.ceil(contestantCount / CONSTANTS.LEETCODE_RANKS_PER_PAGE);
      const batches = this.getPageBatches(pageCount);
      const start = Date.now();
      const result = await this.getLeaderBoard(batches);
      await this.saveLeaderBoard(result);
      const timeTaken = Date.now() - start;
      console.log(`time taken : ${timeTaken} \n result size and object : ${result.length} \n`);
      return { pageCount, contestantCount };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  public async getFriendsRank(friends: string[]) {
    try {
      const friendsRankList = await Contestant.find({ username: { $in: friends } });
      return friendsRankList;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  public async getGlobalRank(page: any) {
    try {
      const globalRankList = await Contestant.find({
        rank: {
          $gt: CONSTANTS.FRONTEND_RANKS_PER_PAGE * (page - 1),
          $lt: CONSTANTS.FRONTEND_RANKS_PER_PAGE * page + 1,
        },
      });
      const contestantCount = await new Promise((resolve) => {
        Contestant.count({}, function (err, count) {
          resolve(count);
        });
      });

      return { globalRankList, contestantCount };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  public async getCountryRank(country: any, page: any) {
    try {
      console.log('country : ', country, 'page : ', page);
      const countryRankList = await Contestant.find({ country_name: country })
        .sort({ rank: 1 })
        .skip(CONSTANTS.FRONTEND_RANKS_PER_PAGE * (page - 1))
        .limit(CONSTANTS.FRONTEND_RANKS_PER_PAGE);
      const contestantCount = await new Promise((resolve) => {
        Contestant.count({ country_name: country }, function (err, count) {
          resolve(count);
        });
      });
      return { countryRankList, contestantCount };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default LeaderBoard;
