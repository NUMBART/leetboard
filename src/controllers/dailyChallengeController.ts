import * as dailyChallengeServices from '../services/dailyChallengeServices';

const getDailyChallenge = (req, res) => {
  dailyChallengeServices.getDailyChallenge(req, res);
};

export { getDailyChallenge };
