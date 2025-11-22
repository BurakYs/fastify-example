import mongoose, { Schema } from 'mongoose';
import { slugValidationFunc } from '@/utils/validations/url/slug';
import { urlValidationFunc } from '@/utils/validations/url/url';

const URLSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      maxlength: 4096,
      validate: {
        validator: urlValidationFunc
      }
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: slugValidationFunc
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
