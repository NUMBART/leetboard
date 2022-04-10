import mongoose from 'mongoose';
import CONSTANTS from '../config/constants';

mongoose.connect(CONSTANTS.MONGO_STRING, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
