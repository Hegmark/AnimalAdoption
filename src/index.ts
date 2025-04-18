import express, { Router } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession  from 'express-session';
import passport from 'passport';
import { configurePassport } from './passport/passport';
import { userRoutes } from './routes/user.routes';
import newsRoutes from './routes/news.routes';


const app = express();
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;
const port = 5000;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));



const whitelist = ['*', 'http://localhost:4200']
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
        if (whitelist.indexOf(origin!) !== -1 || whitelist.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

const sessionOptions: expressSession.SessionOptions = {
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false
};
app.use(expressSession(sessionOptions));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use('/api/user', userRoutes(passport, Router()));
app.use('/api/news', newsRoutes);


app.listen(port, () => {
    console.log('Server is listening on port ' + port.toString());
});




export default app;