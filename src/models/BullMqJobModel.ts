import { Schema } from 'mongoose';

const BullMqJobSchema = new Schema({
  jobOptions: {
    type: Schema.Types.Mixed,
  },
  data: {
    type: Schema.Types.Mixed,
  },
});
