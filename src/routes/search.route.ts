import express from "express";
import { authenticateToken } from "../middleware";
import { SearchController } from "../controller";

const router = express.Router();

/**
 * @swagger
 * /:
 *  get:
 *     summary: Search notes
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query
 *         example: "note"
 *     responses:
 *       200:
 *         description: An array of notes that match the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: 
 *                  array
 *               items:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                              description: The id of the note
 *                              example: 1
 *                          title:
 *                              type: string
 *                              description: The title of the note
 *                              example: "My first note"
 *                          content:
 *                              type: string
 *                              description: The content of the note
 *                              example: "This is the content of my first note"
 *                          created_at:
 *                              type: string
 *                              description: The date and time the note was created
 *                              example: "2021-08-01T12:00:00.000Z"
 *       401:
 *          description: Unauthorized
 *       403:
 *          description: Forbidden
 *       500:
 *          description: Internal server error
 */
router.get('/', authenticateToken, SearchController.searchNotes);

export default router;