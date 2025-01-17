import bcrypt from 'bcrypt';
import { pool } from '../db';
import { User } from '../types';
import jwt from 'jsonwebtoken';
import { ResErrorImpl } from '../types';
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = String(process.env.JWT_SECRET)

// interface ResError extends Error {
//     status: number;
// }

// class ResErrorImpl extends Error implements ResError {
//     status: number;
//     constructor(status: number, message: string) {
//         super(message);
//         this.status = status;
//     }
// }

const createUser = async (user: User) => {
    const { username, password } = user;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            [username, hashedPassword]
        );
        return ({ message: 'User registered successfully! Now log in with your credentials' });
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const loginUser = async (user: User) => {
    const { username, password } = user
    try {
        // Validate user credentials
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            throw new ResErrorImpl(400, 'Invalid username or password.');
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new ResErrorImpl(400, 'Invalid username or password.');
        }

        // Generate a JWT
        const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, {
            expiresIn: '1h', // Token validity
        });

        // Send the token as an HttpOnly cookie
        // res.cookie('token', token, {
        //     httpOnly: true,    // Prevent JavaScript access to the cookie
        //     secure: true,      // Ensures the cookie is sent only over HTTPS
        //     sameSite: 'strict', // Protects against CSRF
        //     maxAge: 3600000,   // Cookie expiration time in milliseconds (1 hour)
        // });

        return { token, message: 'Logged in successfully!' };
    } catch (err) {
        console.error(err);
        throw new ResErrorImpl(500, 'Internal server error.');
    }
}

export default { createUser, loginUser };