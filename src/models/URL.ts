import { slugValidationFunction } from '@/utils/validations/url/slug';
import { urlValidationFunction } from '@/utils/validations/url/url';
import mongoose, { Schema } from 'mongoose';

const URLSchema = new Schema(
    {
        url: {
            type: String,
            required: true,
            maxlength: 4096,
            validate: {
                validator: urlValidationFunction
            }
        },
        slug: {
            type: String,
            unique: true,
            required: true,
            validate: {
                validator: slugValidationFunction
            }
        },
        createdBy: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model('URL', URLSchema);
