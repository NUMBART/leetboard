import CONSTANTS from '../config/constants';
import LeaderBoard from '../models/LeaderBoard';

const getFriends = (req, res) => {
  const friends = req.body.friends;
  const url = CONSTANTS.CONTEST_URL;
  const leaderBoard = new LeaderBoard(url);
  leaderBoard
    .getFriendsRank(friends)
    .then((friendsRankList) => res.send(friendsRankList))
    .catch((e) => console.log(e));
};

export { getFriends };
