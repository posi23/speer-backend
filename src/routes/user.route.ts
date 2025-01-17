import express from 'express';
import { UserController } from '../controller';
import { body } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: 
 *      Sign up a new user
 *     requestBody:
 *       required: 
 *          true
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               username:
 *                 type: "string"
 *                 description: The username of the user
 *                 example: "Jane Doe"
 *               password: 
 *                 type: "string"
 *                 description: The password of the user
 *                 example: "password"
 *     responses:
 *       201:
 *         description: A message indicating that the user was created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                   type: string
 *                   description: A message indicating that the user was created successfully.
 *                   example: User registered successfully! Now log in with your credentials
 * 
 */
router.post('/signup',
    [
        body('username').isString().isLength({ min: 3 }).trim(),
        body('password').isString().isLength({ min: 6 }),
    ],
    UserController.createUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 
 *      Log in a user
 *     requestBody:
 *       required: 
 *          true
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               username:
 *                 type: "string"
 *                 description: The username of the user
 *                 example: "Jane Doe"
 *               password: 
 *                 type: "string"
 *                 description: The password of the user
 *                 example: "password"
 *     responses:
 *       201:
 *         description: A message indicating that the user was logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                   type: string
 *                   description: A message indicating that the user was logged in successfully.
 *                   example: User logged in successfully!
 * 
 */
router.post('/login',
    [body('username').isString().trim(), body('password').isString()],
    UserController.loginUser);

export default router;