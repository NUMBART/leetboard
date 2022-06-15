import * as ratingServices from '../services/ratingServices';

const getFriends = (req, res) => {
  ratingServices.getFriends(req, res);
};

const getGlobal = (req, res) => {
  ratingServices.getGlobal(req, res);
};

const getCountry = (req, res) => {
  ratingServices.getCountry(req, res);
};

export { getFriends, getGlobal, getCountry };
