import { pool } from "../db";
import { Note, ResErrorImpl } from "../types";

const createNote = async (note: Note) => {
    const { title, content, userId } = note;
    try {
        const result = await pool.query(
            'INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
            [title, content, userId]
        );
        return result.rows[0];
        // res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        throw new ResErrorImpl(500, 'Failed to create note.');
    }
}

const getAllNotes = async (userId: string) => {
    try {
        const result = await pool.query(
            `SELECT * FROM notes
             WHERE user_id = $1
             UNION
             SELECT n.*
             FROM notes n
             INNER JOIN shared_notes s ON n.id = s.note_id
             WHERE s.shared_with_user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;
        // res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        throw new ResErrorImpl(500, 'Failed to fetch notes.');
    }
}

const getNoteById = async (noteId: string, userId: string) => {
    try {
        const result = await pool.query(
            `SELECT * FROM notes
             WHERE id = $1 AND user_id = $2 OR id IN (
                 SELECT note_id FROM shared_notes WHERE shared_with_user_id = $2
                 )`,
            [noteId, userId]
        );
        return result.rows[0];
        // res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        throw new ResErrorImpl(500, 'Failed to fetch note.');
    }
}

const updateNote = async (noteId: string, note: Note) => {
    const { title, content } = note;
    try {
        const result = await pool.query(
            `UPDATE notes
             SET title = $1, content = $2
             WHERE id = $3
             RETURNING *`,
            [title, content, noteId]
        );
        return result.rows[0];
        // res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        throw new ResErrorImpl(500, 'Failed to update note.');
    }
}

const shareNote = async (noteId: string, sharedWithUserId: string) => {
    try {
        // Share the note
        await pool.query(
            'INSERT INTO shared_notes (note_id, shared_with_user_id) VALUES ($1, $2)',
            [noteId, sharedWithUserId]
        );
        return { message: 'Note shared successfully!' };
    } catch (err) {
        console.error(err);
        throw new ResErrorImpl(500, 'Failed to share note.');
    }
}

const deleteNote = async (noteId: string) => {
    try {
        await pool.query(
            'DELETE FROM notes WHERE id = $1',
            [noteId]
        );
        return { message: 'Note deleted successfully!' };
    } catch (err) {
        console.error(err);
        throw new ResErrorImpl(500, 'Failed to delete note.');
    }
}

export default { createNote, getAllNotes, getNoteById, updateNote, shareNote, deleteNote };