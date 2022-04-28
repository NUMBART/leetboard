import CONSTANTS from '../config/constants';
import Contest from '../models/Contest';
import LeaderBoard from '../models/LeaderBoard';

// TODO move current implementation to cron at every day 12PM and add separate method to pick from DB
const getLastContest = (req, res) => {
  new Contest()
    .getLastContest()
    .then((response) => res.send(response))
    .catch((e) => console.log(e));
};

export { getLastContest };
