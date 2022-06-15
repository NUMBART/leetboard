const CONSTANTS = {
  PORT: 3000,
  MONGO_STRING: process.env.MONGO_STRING,
  CONTEST_URL: 'https://leetcode.com/contest/api/ranking/',
  LEETCODE_RANKS_PER_PAGE: 25,
  FRONTEND_RANKS_PER_PAGE: 50,
  UPDATE_CONTEST_SCHEDULE: '30 7 * * *',
  CONTEST_SCHEDULER_SCHEDULE: '40 7 * * *',
  LEADERBOARD_UPDATE_SCHEDULE: '*/5 * * * *',
  DAILY_LEADERBOARD_UPDATE_SCHEDULE: '0 10 * * *',
  DAY_IN_SECONDS: 86400,
  BATCH_WAIT_TIME: 2000,
  RETRY_DELAY: 2500,
  REQUESTS_PER_BATCH: 55,
  PROXY: {
    PROTOCOL: 'http',
    HOST: 'p.webshare.io',
    PORT: 80,
    AUTH: {
      USERNAME: 'urmwxuny-rotate',
      PASSWORD: 'k6z0okqirvdi',
    },
  },
  PROXY_AUTHS: [
    {
      USERNAME: 'urmwxuny-rotate',
      PASSWORD: 'k6z0okqirvdi',
    },
    {
      USERNAME: 'tnnqfxsb-rotate',
      PASSWORD: 'b2b2evydsbuy',
    },
    {
      USERNAME: 'nyaqoyda-rotate',
      PASSWORD: 'k6z0okqirvdi',
    },
    {
      USERNAME: 'kkltamzh-rotate',
      PASSWORD: 'p23mea35xk96',
    },
    {
      USERNAME: 'swirbjfp-rotate',
      PASSWORD: '67i08chkddbv',
    },
  ],
  CONTESTS_API_OPTION: {
    baseURL: 'https://leetcode.com/graphql',
    headers: { 'content-type': 'application/json' },
    data: {
      operationName: null,
      variables: {},
      query:
        '{\n  brightTitle\n  currentTimestamp\n  allContests {\n    containsPremium\n    title\n    cardImg\n    titleSlug\n     startTime\n    duration\n    originStartTime\n    isVirtual\n    company {\n      watermark\n      __typename\n    }\n    __typename\n  }\n}\n',
    },
    proxy: {
      protocol: 'http',
      host: 'p.webshare.io',
      port: 80,
      auth: {
        username: 'urmwxuny-rotate',
        password: 'k6z0okqirvdi',
      },
    },
  },
  RATING_LB_OPTION: {
    baseURL: 'https://leetcode.com/graphql',
    headers: { 'content-type': 'application/json' },
    data: {
      operationName: null,
      variables: {},
      query:
        '{\n  globalRanking(page: _page_) {\n    totalUsers\n    userPerPage\n    rankingNodes {\n      ranking\n      currentRating\n      currentGlobalRanking\n      dataRegion\n      user {\n        username\n        profile {\n          countryCode\n          countryName\n          realName\n}\n}\n}\n}\n}\n',
    },
    proxy: {
      protocol: 'http',
      host: 'p.webshare.io',
      port: 80,
      auth: {
        username: 'urmwxuny-rotate',
        password: 'k6z0okqirvdi',
      },
    },
  },
};
export default CONSTANTS;
