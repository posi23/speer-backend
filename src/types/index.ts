import { Request } from "express";

export interface User {
    username: "string",
    password: "string"
}

export interface Note {
    title: "string",
    content: "string",
    userId: "string"
}

interface ResError extends Error {
    status: number;
}

export class ResErrorImpl extends Error implements ResError {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export interface CustomRequest extends Request {
    user?: any;
}