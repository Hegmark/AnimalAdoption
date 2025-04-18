import mongoose, { Document, Model, ObjectId, Schema } from 'mongoose';


export interface IAdoptionRequest extends Document {
    _id: ObjectId,
    animalId: ObjectId,
    userId: ObjectId,
    status: 'pending' | 'approved' | 'rejected',
    message: string,
    meetingDate: Date,
    createdAt: Date,
}

const AdoptionRequestSchema = new Schema<IAdoptionRequest>({
    animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        required: true
    },
    message: { type: String, required: true },
    meetingDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const AdoptionRequest: Model<IAdoptionRequest> = mongoose.model<IAdoptionRequest>('AdoptioRequest', AdoptionRequestSchema);