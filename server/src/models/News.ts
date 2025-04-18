import mongoose, { Document, Model, Schema } from 'mongoose';


export interface INews extends Document {
  title: string;
  content: string;
  date: Date;
  newsId: number;
}

const NewsSchema: Schema<INews> = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const AutoIncrement = require('mongoose-sequence')(mongoose);
(NewsSchema as any).plugin(AutoIncrement, { inc_field: 'newsId' });

export const News: Model<INews> = mongoose.model<INews>('News', NewsSchema);