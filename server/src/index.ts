import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createApp } from './app';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set. Copy server/.env.example to server/.env, or set it in the environment.');
    process.exit(1);
}

const port = 5000;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

let app;
try {
    app = createApp();
} catch (err) {
    console.error((err as Error).message);
    process.exit(1);
}

app.listen(port, () => {
    console.log('Server is listening on port ' + port.toString());
});

export default app;
