import axios from 'axios';

// TODO cleanup implementation
const getDailyChallenge = (req, res) => {
  let data = JSON.stringify({
    operationName: 'codingChallengeMedal',
    variables: {
      year: 2023,
      month: 3,
    },
    query:
      'query codingChallengeMedal($year: Int!, $month: Int!) {\n  dailyChallengeMedal(year: $year, month: $month) {\n    name\n    config {\n      icon\n      __typename\n    }\n    __typename\n  }\n  activeDailyCodingChallengeQuestion {\n    link\n    __typename\n  }\n}\n',
  });

  let config: any = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://leetcode.com/graphql',
    headers: {
      authority: 'leetcode.com',
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
      cookie:
        'gr_user_id=f02c610f-c175-4437-a0c3-45429283fa22; 87b5a3c3f1a55520_gr_last_sent_cs1=NUMBART; __stripe_mid=86c19c82-79cb-4668-87d3-4be5321aa3674f91e7; _ga_CDRWKZTDEX=deleted; __atuvc=1%7C10; csrftoken=ZAEsUsnbvhSvqJYLIMgAGSc7JmqsMkvYoSmDm9AgahjhohJEU7IWqbXletBRdKbd; LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMjU1NjY0OSIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNmRhMWNlZGZhOGZlMmJjYzcxNzExNzM0YWJiOGRiMzMzMDEyMWYyYSIsImlkIjoyNTU2NjQ5LCJlbWFpbCI6Im1hZGh1bWl0YXBhbmRleTcyQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiTlVNQkFSVCIsInVzZXJfc2x1ZyI6Ik5VTUJBUlQiLCJhdmF0YXIiOiJodHRwczovL3MzLXVzLXdlc3QtMS5hbWF6b25hd3MuY29tL3MzLWxjLXVwbG9hZC9hc3NldHMvZGVmYXVsdF9hdmF0YXIuanBnIiwicmVmcmVzaGVkX2F0IjoxNjc5NzIwNzU2LCJpcCI6IjExNS4xODcuNDAuMTUxIiwiaWRlbnRpdHkiOiIwOGM4NmFmOWQxZTUxZWFiZGUzY2EyMGM1ZTI5MzMwOCIsIl9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMCwic2Vzc2lvbl9pZCI6MzY2MjAyMjh9.ih4Ls63Rrr4G86DxAq6Gf-aaayTVvdJ7bfFTZi11HO8; _gid=GA1.2.1630087143.1679720757; _lr_tabs_-7j19o6%2Ffx={%22sessionID%22:0%2C%22recordingID%22:%225-460f70b9-3273-42fe-8310-e7981c9fcbf0%22%2C%22lastActivity%22:1679807727819}; _lr_hb_-7j19o6%2Ffx={%22heartbeat%22:1679807848255}; 87b5a3c3f1a55520_gr_session_id=7571822d-f900-465f-9362-7f75910bb3c0; 87b5a3c3f1a55520_gr_last_sent_sid_with_cs1=7571822d-f900-465f-9362-7f75910bb3c0; 87b5a3c3f1a55520_gr_session_id_7571822d-f900-465f-9362-7f75910bb3c0=true; _gat=1; __stripe_sid=3ec4d174-519e-42cc-82a1-346ab5bab7a4383214; _ga_CDRWKZTDEX=GS1.1.1679845049.269.1.1679845078.0.0.0; _ga=GA1.2.2120929539.1660024990; 87b5a3c3f1a55520_gr_cs1=NUMBART; _dd_s=rum=0&expire=1679845979701; csrftoken=XWZRe5hO3PD4590XxHRiP1HUDqXCdQSOAu1fbTkiFBWcrgAvuTeNTlhiz1tuAQ77',
      origin: 'https://leetcode.com',
      referer: 'https://leetcode.com/problemset/all/',
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log('daily challenge problem: ', JSON.stringify(response.data));
      res.status(200).send({
        link:
          'https://www.leetcode.com' + response.data.data.activeDailyCodingChallengeQuestion.link,
      });
    })
    .catch((error) => {
      console.log('daily challenge error: ', error);
    });
};

export { getDailyChallenge };
