import mongoose from 'mongoose';
const { Schema } = mongoose;

const userBadge = new Schema({
  icon: 'string',
  display_name: 'string',
});

const submission = new Schema({
  question_id: Number,
  fail_count: Number,
  submission_id: Number,
  timestamp: Number,
});

const Contestant = mongoose.model('Contestant', {
  username: {
    type: String,
    required: true,
  },
  username_color: {
    type: String,
  },
  user_badge: userBadge,
  user_slug: {
    type: String,
  },
  country_code: String,
  country_name: String,
  rank: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  finish_time: {
    type: Number,
    required: true,
  },
  submissions: {
    type: Map,
  },
});

export default Contestant;
