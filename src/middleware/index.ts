import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types';
import dotenv from 'dotenv';
dotenv.config();



const jwtSecret = process.env.JWT_SECRET || 'secret';

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token; // Extract token from the cookie
    if (!token) {
        res.status(401).json({ error: 'Access denied, you need to be logged in to access this resource.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// const authorizeAllNotesAccess = async (req: CustomRequest, res: Response, next: NextFunction) => {
//     try {
//         const result = await pool.query(
//             `SELECT * FROM notes
//              WHERE user_id = $1
//              UNION
//              SELECT n.*
//              FROM notes n
//              INNER JOIN shared_notes s ON n.id = s.note_id
//              WHERE s.shared_with_user_id = $1`,
//             [req.user.id]
//         );

//         if (result.rows.length === 0) {
//             res.status(403).send('You have no notes! Please create one...!');
//             return
//         }

//         next();
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to authorize access.' });
//     }
// }

const authorizeNoteAccess = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        // Check if the note belongs to the user or is shared with them
        const result = await pool.query(
            `SELECT * FROM notes
             WHERE id = $1 AND (user_id = $2 OR id IN (
                 SELECT note_id FROM shared_notes WHERE shared_with_user_id = $2
             ))`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            res.status(403).json({ error: 'Access denied.' });
            return;
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to authorize access.' });
    }
};

const authorizeNoteOwner = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM notes
             WHERE id = $1 AND user_id = $2`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            res.status(403).json({ error: 'Access denied.' });
            return;
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to authorize access.' });
    }
}


export { authenticateToken, authorizeNoteAccess, authorizeNoteOwner };