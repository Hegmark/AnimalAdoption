import mongoose, { Document, Model, Schema, ObjectId } from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_FACTOR = 10;

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'adopter';
  favorites: mongoose.Types.ObjectId[];
  meetings: {
    animalId: mongoose.Types.ObjectId;
    date: Date;
  }[];
  comparePassword: (
    candidatePassword: string,
    callback: (error: Error | null, isMatch: boolean) => void
  ) => void;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'adopter'], default: 'adopter' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }],
  meetings: [{
    animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    date: { type: Date, required: true }
  }]
}, { timestamps: true });



UserSchema.pre<IUser>('save', async function(next) {
    if (!this.isModified('passwordHash')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

UserSchema.methods.comparePassword = function(
    candidatePassword: string,
    callback: (error: Error | null, isMatch: boolean) => void
): void {
    bcrypt.compare(candidatePassword, this.passwordHash)
        .then(isMatch => callback(null, isMatch))
        .catch(error => callback(error, false));
}



export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);