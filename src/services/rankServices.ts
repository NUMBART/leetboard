import CONSTANTS from '../config/constants';
import Contest from '../models/Contest';
import LeaderBoard from '../models/LeaderBoard';

const getFriends = (req, res) => {
  const friends = req.body.friends;
  new Contest()
    .getLastContest()
    .then(({ titleSlug }) => {
      const url = CONSTANTS.CONTEST_URL + titleSlug + '/';
      const leaderBoard = new LeaderBoard(url);
      leaderBoard
        .getFriendsRank(friends)
        .then((friendsRankList) => res.send(friendsRankList))
        .catch((e) => console.log(e));
    })
    .catch((e) => {
      console.log(e);
    });
};

const getGlobal = (req, res) => {
  const page = parseInt(req.query.page);
  new Contest()
    .getLastContest()
    .then(({ titleSlug }) => {
      const url = CONSTANTS.CONTEST_URL + titleSlug + '/';
      const leaderBoard = new LeaderBoard(url);
      leaderBoard
        .getGlobalRank(page)
        .then((rankList) => res.send(rankList))
        .catch((e) => console.log(e));
    })
    .catch((e) => {
      console.log(e);
    });
};

const getCountry = (req, res) => {
  const page = parseInt(req.query.page);
  const country = req.query.country;
  new Contest()
    .getLastContest()
    .then(({ titleSlug }) => {
      const url = CONSTANTS.CONTEST_URL + titleSlug + '/';
      const leaderBoard = new LeaderBoard(url);
      leaderBoard
        .getCountryRank(country, page)
        .then((rankList) => res.send(rankList))
        .catch((e) => console.log(e));
    })
    .catch((e) => {
      console.log(e);
    });
};

export { getFriends, getGlobal, getCountry };
