import mongoose, { Schema, ValidatorProps } from 'mongoose';
import urlValidation from '@/helpers/validations/url/url';
import slugValidation from '@/helpers/validations/url/slug';

interface IURL {
    url: string;
    slug: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

const URLSchema = new Schema<IURL>({
    url: {
        type: String,
        required: true,
        maxlength: 4096,
        validate: {
            validator: urlValidation,
            message: (props: ValidatorProps) => props.reason?.message || ''
        }
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: slugValidation,
            message: (props: ValidatorProps) => props.reason?.message || ''
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

export default mongoose.model<IURL>('URL', URLSchema);