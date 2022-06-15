import RatingLeaderBoard from '../models/RatingLeaderBoard';

const getFriends = (req, res) => {
  const friends = req.body.friends;

  const leaderBoard = new RatingLeaderBoard(null);
  leaderBoard
    .getFriendsRank(friends)
    .then((friendsRankList) => res.send(friendsRankList))
    .catch((e) => console.log(e));
};

const getGlobal = (req, res) => {
  const page = parseInt(req.query.page);
  const leaderBoard = new RatingLeaderBoard(null);
  leaderBoard
    .getGlobalRank(page)
    .then((rankList) => res.send(rankList))
    .catch((e) => console.log(e));
};

const getCountry = (req, res) => {
  const page = parseInt(req.query.page);
  const country = req.query.country;
  const leaderBoard = new RatingLeaderBoard(null);
  leaderBoard
    .getCountryRank(country, page)
    .then((rankList) => res.send(rankList))
    .catch((e) => console.log(e));
};

export { getFriends, getGlobal, getCountry };
