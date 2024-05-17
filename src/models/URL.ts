import mongoose, { Document, Schema, SchemaOptions } from 'mongoose';
import urlValidation from '@/helpers/validations/url/url';
import slugValidation from '@/helpers/validations/url/slug';

type ValidationError = {
    reason: Error
};

export type URLType = Document & {
    url: string;
    slug: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

const URLSchema = new Schema({
    url: {
        type: String,
        required: true,
        validate: {
            validator: urlValidation,
            message: ({ reason }: ValidationError) => reason.message
        }
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: slugValidation,
            message: ({ reason }: ValidationError) => reason.message
        }
    },
    createdBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
} as SchemaOptions);

export default mongoose.model('URL', URLSchema);