import express, { Request, Response } from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './swagger-config';
import { pool, connect } from "./db";
// import { pool } from "./db";
import { NotesRoute, SearchRoute, UserRoute } from "./routes";

dotenv.config();

const app = express();
app.set('trust proxy', 1)
connect(); // connect to the db
app.use(express.json());
app.use(cookieParser());

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});

const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // Allow 50 requests per windowMs before slowing down
    delayMs: () => 500, // Add 500ms delay per request above the delayAfter threshold
    maxDelayMs: 5000, // Maximum delay of 5 seconds per request
    message: 'You are sending requests too quickly. Please slow down.',
});

app.use(speedLimiter, rateLimiter);

const PORT = process.env.PORT || 3000;

app.use('/api/auth', UserRoute);
app.use('/api/notes', NotesRoute);
app.use('/api/search', SearchRoute);

// practice route
app.get("/", (req: Request, res: Response) => {
    pool.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal server error");
        }
        res.status(200).json(result.rows);
    }
    );
});


export const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
