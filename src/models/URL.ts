import mongoose, { Schema, type ValidatorProps } from 'mongoose';
import urlValidation from '@/utils/validations/url/url';
import slugValidation from '@/utils/validations/url/slug';

const URLSchema = new Schema({
    url: {
        type: String,
        required: true,
        maxlength: 4096,
        validate: {
            validator: urlValidation,
            message: (props: ValidatorProps) => props.reason?.message || 'URL is not valid'
        }
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: slugValidation,
            message: (props: ValidatorProps) => props.reason?.message || 'Slug is not valid'
        }
    },
    createdBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model('URL', URLSchema);