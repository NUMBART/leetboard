import * as contestServices from '../services/contestServices';

const getLastContest = (req, res) => {
  contestServices.getLastContest(req, res);
};

export { getLastContest };
