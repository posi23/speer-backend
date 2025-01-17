import { UserService } from "../service";
import { validationResult } from "express-validator";
import { Request, Response } from "express";

const createUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        const response = await UserService.createUser(req.body);
        res.status(201).json(response);
    } catch (err: any) {
        if (err.code === '23505') {
            res.status(400).json({ error: 'Username already exists' });
        } else {
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
}

const loginUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    try {
        const { token, message } = await UserService.loginUser(req.body);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 3600000,
        });

        res.status(200).json(message);
    } catch (err: any) {
        res.status(err.status).json({ error: err.message });
    }
}

export default { createUser, loginUser };