import mongoose, { Document, Model, Schema, ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_FACTOR = 10;

export interface IUser extends Document {
  _id: ObjectId,
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



UserSchema.pre<IUser>('save', function(next) {
    const user = this;

    if (!user.isModified('passwordHash')) {
        return next();
    }
    
    bcrypt.genSalt(SALT_FACTOR, (error, salt) => {
        if (error) {
            return next(error);
        }
        bcrypt.hash(user.passwordHash, salt, (err, encrypted) => {
            if (err) {
                return next(err);
            }
            user.passwordHash = encrypted;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void): void {
    const user = this;
    bcrypt.compare(candidatePassword, user.passwordHash, (error, isMatch) => {
        if (error) {
            console.log("Error comparing password:", error);
            callback(error, false);
        }
        callback(null, isMatch);
    });
}



export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);