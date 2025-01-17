import { NoteService } from "../service";
import { CustomRequest } from "../types";
import { Response } from "express";

const createNote = async (req: CustomRequest, res: Response) => {
    const { title, content } = req.body;

    if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required.' });
        return;
    }

    const userId = req.user.id;
    try {
        const response = await NoteService.createNote({ title, content, userId });
        res.status(201).json(response);
    } catch (error: any) {
        res.status(error.status).json({ error: error.message });
    }
}

const getAllNotes = async (req: CustomRequest, res: Response) => {
    const userId = req.user.id;
    try {
        const response = await NoteService.getAllNotes(userId);
        res.status(200).json(response);
    } catch (error: any) {
        res.status(error.status).json({ error: error.message });
    }
}

const getNoteById = async (req: CustomRequest, res: Response) => {
    const userId = req.user.id;
    const noteId = req.params.id;
    try {
        const response = await NoteService.getNoteById(noteId, userId);
        res.status(200).json(response);
    } catch (error: any) {
        res.status(error.status).json({ error: error.message });
    }
}

const updateNote = async (req: CustomRequest, res: Response) => {
    const userId = req.user.id;
    const noteId = req.params.id;
    const { title, content } = req.body;
    try {
        const response = await NoteService.updateNote(noteId, { title, content, userId });
        res.status(200).json(response);
    } catch (error: any) {
        res.status(error.status).json({ error: error.message });
    }
}

const shareNote = async (req: CustomRequest, res: Response) => {
    const { sharedWithUserId } = req.body;
    const noteId = req.params.id;
    try {
        const response = await NoteService.shareNote(noteId, sharedWithUserId);
        res.status(200).json(response);
    } catch (error: any) {
        res.status(error.status).json({ error: error.message });
    }
}

const deleteNote = async (req: CustomRequest, res: Response) => {
    const noteId = req.params.id;
    try {
        const response = await NoteService.deleteNote(noteId);
        res.status(200).json(response);
    } catch (error: any) {
        res.status(error.status).json({ error: error.message });
    }
}

export default { createNote, getAllNotes, getNoteById, updateNote, shareNote, deleteNote };