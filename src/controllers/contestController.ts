import * as contestServices from '../services/contestServices';

const getNextContest = (req, res) => {
  contestServices.getNextContest(req, res);
};

export { getNextContest };
