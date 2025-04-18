import mongoose, { Document, Model, ObjectId, Schema } from 'mongoose';


export interface IAnimal extends Document {
    _id: ObjectId,
    name: string,
    species: string,
    breed: string,
    age: number,
    description: string,
    temperament: string,
    healthInfo: string,
    images?: [string], 
    available: boolean,
    createdAt: Date
    animalId: number
}

const AnimalSchema = new Schema<IAnimal>({
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String, required: true },
    temperament: { type: String, required: true },
    healthInfo: { type: String, required: true },
    images: [{ type: String }], 
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const AutoIncrement = require('mongoose-sequence')(mongoose);
(AnimalSchema as any).plugin(AutoIncrement, { inc_field: 'animalId' });

export const Animal: Model<IAnimal> = mongoose.model<IAnimal>('Animal', AnimalSchema);