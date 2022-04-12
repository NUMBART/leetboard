import CONSTANTS from '../config/constants';
import Contest from '../models/Contest';
import LeaderBoard from '../models/LeaderBoard';

// TODO move current implementation to cron at every day 12PM and add separate method to pick from DB
const getNextContest = (req, res) => {
  new Contest()
    .getNextContest()
    .then((response) => res.send(response))
    .catch((e) => console.log(e));
};

export { getNextContest };
