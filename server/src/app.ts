import express, { Router, Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport from 'passport';
import { configurePassport } from './passport/passport';
import { userRoutes } from './routes/user.routes';
import newsRoutes from './routes/news.routes';
import animalRoutes from './routes/animal.routes';
import adoptionRoutes from './routes/adoptionRequest.routes';
import path from 'path';

// Builds the configured Express app WITHOUT connecting to MongoDB or starting a
// listener, so it can be imported directly by tests (which manage their own DB).
export function createApp(): Express {
    const app = express();

    const SESSION_SECRET = process.env.SESSION_SECRET;
    if (!SESSION_SECRET) {
        throw new Error('SESSION_SECRET is not set. Copy .env.example to .env, or set it in the environment.');
    }

    // Comma-separated list of browser origins allowed to call the API.
    const CORS_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:4200,http://localhost:8080')
        .split(',')
        .map(o => o.trim())
        .filter(Boolean);

    // Only send the session cookie over HTTPS when explicitly enabled.
    const COOKIE_SECURE = process.env.SESSION_COOKIE_SECURE === 'true';

    const corsOptions = {
        origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
            // Allow non-browser / same-origin requests (no Origin header) and whitelisted origins.
            if (!origin || CORS_ORIGINS.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS.'));
            }
        },
        credentials: true
    };
    app.use(cors(corsOptions));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    const sessionOptions: expressSession.SessionOptions = {
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: COOKIE_SECURE
        }
    };
    app.use(expressSession(sessionOptions));
    app.use(express.json());

    app.use(passport.initialize());
    app.use(passport.session());
    configurePassport(passport);

    const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
    app.use('/uploads', express.static(UPLOADS_DIR, { fallthrough: false }));

    app.get('/health', async (_req, res) => {
        try {
            if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
                throw new Error('database not connected');
            }
            await mongoose.connection.db.admin().ping();
            res.status(200).json({ status: 'ok', db: 'up' });
        } catch {
            res.status(503).json({ status: 'error', db: 'down' });
        }
    });

    app.use('/api/user', userRoutes(passport, Router()));
    app.use('/api/news', newsRoutes);
    app.use('/api/animals', animalRoutes);
    app.use('/api/adoption', adoptionRoutes);

    return app;
}
