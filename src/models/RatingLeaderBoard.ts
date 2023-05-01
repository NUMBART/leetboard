import axios from 'axios';
import retry from 'retry';
import _ from 'lodash';
import CONSTANTS from '../config/constants';
import LeaderBoard from './LeaderBoard';
import RatingNode from './RatingNode';

class RatingLeaderBoard extends LeaderBoard {
  protected url: any;
  protected options: any;
  constructor(url) {
    super(url);
    this.options = CONSTANTS.RATING_LB_OPTION;
  }
  async getRankPage(page: number): Promise<any> {
    let options = _.cloneDeep(this.options);
    options.data.query = options.data.query.replace('_page_', page);
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
  protected async getContestantCount() {
    try {
      const response = await this.getRankPage(1);
      return response.data.globalRanking.totalUsers;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  protected async saveLeaderBoard(result: any) {
    try {
      const users = [];
      result.forEach((response) => {
        response.data.globalRanking.rankingNodes.forEach((node) => {
          const { ranking, currentRating, currentGlobalRanking, dataRegion, user } = node;
          const userNode = {
            ranking,
            currentRating,
            currentGlobalRanking,
            dataRegion,
            username: user.username,
            countryCode: user.profile.countryCode,
            countryName: user.profile.countryName,
            realName: user.profile.realName,
          };
          users.push(userNode);
        });
      });
      console.log('sample user : ', users[0].username);
      const start = Date.now();
      await RatingNode.bulkWrite(
        users.map((user) => {
          return {
            updateOne: {
              filter: { username: user.username },
              update: { $set: user },
              upsert: true,
            },
          };
        }),
        { ordered: false }
      );
      console.log(`Contestants inserted in ${Date.now() - start} ms`);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  public async updateLeaderBoard() {
    try {
      const contestantCount: number = await this.getContestantCount();
      let pageCount = Math.ceil(contestantCount / CONSTANTS.LEETCODE_RANKS_PER_PAGE);
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
  public async getFriendsRank(friends: string[]): Promise<any> {
    try {
      const friendsRankList = await RatingNode.find({ username: { $in: friends } });
      return friendsRankList;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  public async getGlobalRank(page: any): Promise<any> {
    try {
      const globalRankList = await RatingNode.find({
        currentGlobalRanking: {
          $gt: CONSTANTS.FRONTEND_RANKS_PER_PAGE * (page - 1),
          $lt: CONSTANTS.FRONTEND_RANKS_PER_PAGE * page + 1,
        },
      });
      const contestantCount = await RatingNode.countDocuments({});
      return { globalRankList, contestantCount };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  public async getCountryRank(country: any, page: any): Promise<any> {
    try {
      console.log('country : ', country, 'page : ', page);
      const countryRankList = await RatingNode.find({ countryName: country })
        .sort({ currentGlobalRanking: 1 })
        .skip(CONSTANTS.FRONTEND_RANKS_PER_PAGE * (page - 1))
        .limit(CONSTANTS.FRONTEND_RANKS_PER_PAGE);
      const contestantCount = await RatingNode.countDocuments({ countryName: country });
      return { countryRankList, contestantCount };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default RatingLeaderBoard;
