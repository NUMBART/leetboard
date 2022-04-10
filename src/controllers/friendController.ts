import * as friendServices from '../services/friendServices';

const someEndpoint = (req, res) => {
  friendServices.someEndpoint(req, res);
};

export { someEndpoint };
