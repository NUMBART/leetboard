import * as friendServices from '../services/friendServices';

const getFriends = (req, res) => {
  friendServices.getFriends(req, res);
};

export { getFriends };
