import * as rankServices from '../services/rankServices';

const getFriends = (req, res) => {
  rankServices.getFriends(req, res);
};

const getGlobal = (req, res) => {
  rankServices.getGlobal(req, res);
};

const getCountry = (req, res) => {
  rankServices.getCountry(req, res);
};

export { getFriends, getGlobal, getCountry };
