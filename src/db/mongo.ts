import mongoose from 'mongoose';
import CONSTANTS from '../config/constants';

mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
