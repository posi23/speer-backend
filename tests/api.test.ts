import request from 'supertest';
import app, { server } from '../src'; // Import your Express app
import { pool } from '../src/db'; // Import your database connection

// Mock Data
const mockUser = { username: 'testuser', password: 'password123' };
const mockUser2 = { username: 'testuser2', password: 'password123' };
let authToken: string;

// Connect to the database
beforeAll(async () => {
    // Reset the database
    await pool.query('TRUNCATE users, notes, shared_notes RESTART IDENTITY CASCADE');
});

afterAll(async () => {
    // Close the database connection
    await pool.end();
    server.close();
});

describe('API Tests', () => {
    // Test Signup Endpoint (Create 1st User)
    it('POST /api/auth/signup should create a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send(mockUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('User registered successfully! Now log in with your credentials');
    });

    // Test Signup Endpoint (Create 2nd User)
    it('POST /api/auth/signup should create a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send(mockUser2);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('User registered successfully! Now log in with your credentials');
    });

    // Test Login Endpoint
    it('POST /api/auth/login should set a cookie for valid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send(mockUser);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('Logged in successfully!');
        expect(res.headers['set-cookie']).toBeDefined();
        const cookie = res.headers['set-cookie'][0];
        authToken = cookie;
        expect(cookie.startsWith('token=')).toBeTruthy();
    });

    // Test Note Creation
    it('POST /api/notes should create a new note for the logged-in user', async () => {
        const res = await request(app)
            .post('/api/notes')
            .set('Cookie', authToken) // Send auth token in cookies
            .send({ title: 'Test Note', content: 'This is a test note.' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Note');
    });

    // Test Retrieve My Notes
    it('GET /api/notes should return notes created by the logged-in user and shared with the logged in user', async () => {
        const res = await request(app)
            .get('/api/notes')
            .set('Cookie', authToken); // Send auth token in cookies

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
    });

    // Test Retrieve Note by ID
    it('GET /api/notes/:id should return a note by ID', async () => {
        // Assuming note ID 1 exists
        const res = await request(app)
            .get('/api/notes/1')
            .set('Cookie', authToken); // Send auth token in cookies

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(1);
    });

    // Test Retrieve Shared Notes
    it('POST /api/notes/:id/share should have the logged-in user shared a note with another user', async () => {
        const sharedWithUserId = 2;
        const res = await request(app)
            .post('/api/notes/1/share')
            .set('Cookie', authToken) // Send auth token in cookies
            .send({ sharedWithUserId });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Note shared successfully!');
    });

    // Test Search Notes
    it('GET /api/search should return notes matching the search keyword', async () => {
        const res = await request(app)
            .get('/api/search?q=Test')
            .set('Cookie', authToken); // Send auth token in cookies

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // Test Update Note
    it('PUT /api/notes/:id should update a note by ID', async () => {
        const res = await request(app)
            .put('/api/notes/1')
            .set('Cookie', authToken) // Send auth token in cookies
            .send({ title: 'Updated Note', content: 'This is an updated note.' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Updated Note');
    });

    // Test Delete Note
    it('DELETE /api/notes/:id should delete a note by ID', async () => {
        const res = await request(app)
            .delete('/api/notes/1')
            .set('Cookie', authToken); // Send auth token in cookies

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Note deleted successfully!');
    });
});

// const closeDB = async () => await pool.end(); // Close the database connection
// afterAll(closeDB); // Close the database connection after all tests are done