import './dist/src/db/mongo';
import Question from './dist/src/models/Question';

const me = new Question({
  id: 2618,
  question_id: 2345,
  credit: 3,
  title: 'Minimum Number of Operations to Convert Time',
  title_slug: 'minimum-number-of-operations-to-convert-time',
});

me.save()
  .then(() => {
    console.log(me);
  })
  .catch((error) => {
    console.log('Error!', error);
  });

// import mongodb from 'mongodb';
// const { MongoClient } = mongodb;
// import got from 'got';
// import { HttpsProxyAgent } from 'hpagent';
// import { RotatingProxy } from './dist/src/models/RotatingProxy';
// const password = 'CpiUJQkjAEAV2sI9';
// const client = new MongoClient(
//   `mongodb+srv://board:${password}@leeter-board.fetwp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
//   { useNewUrlParser: true }
// );

// client
//   .connect()
//   .then(async () => {
//     await client.db('admin').command({ ping: 1 });
//     console.log('Connected successfully to server');
//   })
//   .catch((err) => console.log(err));

// class LeaderBoard {
//   constructor(url) {
//     this.url = url;
//   }
//   async getRankPage(page) {
//     const rotatingProxy = new RotatingProxy();
//     const options = {
//       url: this.url,
//       searchParams: {
//         pagination: page,
//         region: 'global',
//       },
//       agent: {
//         https: new HttpsProxyAgent({
//           keepAlive: true,
//           keepAliveMsecs: 1000,
//           maxSockets: 256,
//           maxFreeSockets: 256,
//           scheduling: 'lifo',
//           proxy: 'http://128.199.214.87:3128',
//         }),
//       },
//     };
//     const response = await got(options);
//     return response;
//   }
// }
// const url = 'https://leetcode.com/contest/api/ranking/weekly-contest-287/';
// const leaderBoard = new LeaderBoard(url);
// leaderBoard
//   .getRankPage(2)
//   .then((response) => {
//     console.log(response.body);
//   })
//   .catch((e) => console.log(e));
