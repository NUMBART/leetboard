import mongoose from 'mongoose';

const Question = mongoose.model('Question', {
  id: {
    type: Number,
    required: true,
  },
  question_id: {
    type: Number,
    required: true,
  },
  credit: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
  },
  title_slug: {
    type: String,
    required: true,
  },
});

export default Question;
