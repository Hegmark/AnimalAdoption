import mongoose, { Document, Model, ObjectId, Schema } from 'mongoose';


export interface IAdoptionRequest extends Document {
    _id: ObjectId,
    animalId: ObjectId,
    userId: ObjectId,
    status: 'pending' | 'approved' | 'rejected',
    message: string,
    adoptionDate: Date,
    createdAt: Date,
    adReId: number
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
    adoptionDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

const AutoIncrement = require('mongoose-sequence')(mongoose);
(AdoptionRequestSchema as any).plugin(AutoIncrement, { inc_field: 'adReId' });

export const AdoptionRequest: Model<IAdoptionRequest> = mongoose.model<IAdoptionRequest>('AdoptionRequest', AdoptionRequestSchema);