import mongoose, { Schema } from 'mongoose';
import { slugValidator, urlValidator } from '@/schemas/url';

const URLSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      validate: {
        validator: urlValidator
      }
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: slugValidator
      }
    },
    createdBy: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('URL', URLSchema);
