import { pool } from "../db";
import { ResErrorImpl } from "../types";

const searchNotes = async (userId: string, query: string) => {
    try {
        const result = await pool.query(
            `SELECT DISTINCT n.*
             FROM notes n
             LEFT JOIN shared_notes s ON n.id = s.note_id
             WHERE
                 (n.user_id = $1 OR s.shared_with_user_id = $1)
                 AND n.search_index @@ plainto_tsquery('english', $2)
             ORDER BY n.created_at DESC`,
            [userId, query.toLowerCase()]
        );
        return result.rows;
    } catch (err) {
        console.error(err);
        throw new ResErrorImpl(500, 'Failed to search notes.');
    }
}

export default { searchNotes };