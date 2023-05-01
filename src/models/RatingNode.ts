import mongoose, { Schema } from 'mongoose';

const RatingNode = mongoose.model('RatingNode', new Schema({
  ranking: {
    type: String,
    required: true,
  },
  currentRating: {
    type: Number,
    required: true,
  },
  currentGlobalRanking: {
    type: Number,
    required: true,
  },
  dataRegion: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
  },
  countryName: {
    type: String,
  },
  realName: {
    type: String,
  },
}));

export default RatingNode;
