import express from "express";
import { authenticateToken, authorizeNoteAccess, authorizeNoteOwner } from "../middleware";
import { NotesController } from "../controller";

const router = express.Router();

/**
 * @swagger
 * /:
 *   post:
 *    summary: Create a new note
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: "object"
 *                  properties:
 *                      title:
 *                          type: "string"
 *                          description: The title of the note
 *                          example: "My first note"
 *                      content:
 *                          type: "string"
 *                          description: The content of the note
 *                          example: "This is the content of my first note"
 *    responses:
 *      201:
 *          description: A message indicating that the note was created successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              description: A message indicating that the note was created successfully.
 *                              example: Note created successfully
 *      401:
 *         description: Unauthorized
 *      403:
 *          description: Forbidden
 *      500:
 *          description: Internal server error
 */
router.post('/', authenticateToken, NotesController.createNote);

/**
 * @swagger
 * /:
 *  get:
 *      summary: Get all notes for the authenticated user
 *      responses:
 *          200:
 *              description: An array of notes for the authenticated user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: 
 *                              array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      description: The id of the note
 *                                      example: 1
 *                                  title:
 *                                      type: string
 *                                      description: The title of the note
 *                                      example: "My first note"
 *                                  content:
 *                                      type: string
 *                                      description: The content of the note
 *                                      example: "This is the content of my first note"
 *                                  created_at:
 *                                      type: string
 *                                      description: The date and time the note was created
 *                                      example: "2021-08-01T12:00:00.000Z"
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden
 *          500:
 *              description: Internal server error
 * 
 */
router.get('/', authenticateToken, NotesController.getAllNotes);

/**
 * @swagger
 * /{id}:
 *  get:
 *      summary: Get a note by id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: The id of the note
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: The note with the specified id
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  description: The id of the note
 *                                  example: 1
 *                              title:
 *                                  type: string
 *                                  description: The title of the note
 *                                  example: "My first note"
 *                              content:
 *                                  type: string
 *                                  description: The content of the note
 *                                  example: "This is the content of my first note"
 *                              created_at:
 *                                  type: string
 *                                  description: The date and time the note was created
 *                                  example: "2021-08-01T12:00:00.000Z"
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden
 *          404:
 *              description: Note not found
 *          500:
 *              description: Internal server error
 * 
 */
router.get('/:id', authenticateToken, authorizeNoteAccess, NotesController.getNoteById);

/**
 * @swagger
 * /{id}:
 *  put:
 *      summary: Update a note by id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: The id of the note
 *            schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                              description: The title of the note
 *                              example: "My updated note"
 *                          content:
 *                              type: string
 *                              description: The content of the note
 *                              example: "This is the updated content of my note"
 *      responses:
 *          200:
 *              description: A message indicating that the note was updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: A message indicating that the note was updated successfully
 *                                  example: Note updated successfully
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden
 *          404:
 *              description: Note not found
 *          500:
 *              description: Internal server error
 * 
 */
router.put('/:id', authenticateToken, authorizeNoteOwner, NotesController.updateNote); // Only the owner of the note can update it

/**
 * @swagger
 * /{id}/share:
 *  post:
 *      summary: Share a note with another user
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: The id of the note
 *            schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: The username of the user to share the note with
 *                              example: "Jane Doe"
 *      responses:
 *          200:
 *              description: A message indicating that the note was shared successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: A message indicating that the note was shared successfully
 *                                  example: Note shared successfully
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden
 *          404:
 *              description: Note not found
 *          500:
 *              description: Internal server error
 * 
 */
router.post('/:id/share', authenticateToken, authorizeNoteOwner, NotesController.shareNote); // Only the owner of the note can share it

/**
 * @swagger
 * /{id}:
 *  delete:
 *      summary: Delete a note by id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: The id of the note
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: A message indicating that the note was deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: A message indicating that the note was deleted successfully
 *                                  example: Note deleted successfully
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden
 *          404:
 *              description: Note not found
 *          500:
 *              description: Internal server error
 * 
 */
router.delete('/:id', authenticateToken, authorizeNoteOwner, NotesController.deleteNote); // Only the owner of the note can delete it

export default router;