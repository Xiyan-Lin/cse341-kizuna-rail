import { describe, expect, test, vi } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Trip from '../src/models/schemas/trips.js';
const firstId = 'alpine-panorama';
describe('W03 Trips feature', () => {
    test('lists seeded trips', async () => {
        const response = await request(app).get('/api/trips');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body.trips).toHaveLength(6);
        expect(response.body.trips).toEqual(expect.arrayContaining([expect.objectContaining({ id: firstId })]));
    });
    test('returns one trip', async () => {
        const response = await request(app).get(`/api/trips/${firstId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(firstId);
        expect(response.body).not.toHaveProperty('_id');
    });
    test('returns JSON 404', async () => {
        const response = await request(app).get('/api/trips/not-a-trip');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Trip not found' });
    });
    test('list database failure returns safe 500', async () => {
        const spy = vi.spyOn(Trip, 'find').mockImplementationOnce(() => { throw new Error('private database detail'); });
        try {
            const response = await request(app).get('/api/trips');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to fetch trips' });
        } finally { spy.mockRestore(); }
    });
    test('detail database failure returns safe 500', async () => {
        const spy = vi.spyOn(Trip, 'findOne').mockImplementationOnce(() => { throw new Error('private database detail'); });
        try {
            const response = await request(app).get(`/api/trips/${firstId}`);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to fetch trip' });
        } finally { spy.mockRestore(); }
    });
    test('list renders empty container and template', async () => {
        const response = await request(app).get('/trips');
        expect(response.status).toBe(200);
        expect(response.text).toContain('trip-card-template');
        expect(response.text).toContain('id="trips-list"');
        expect(response.text).not.toContain('Alpine Panorama Express');
    });
    test('details page renders model data', async () => {
        const response = await request(app).get(`/trips/${firstId}`);
        expect(response.status).toBe(200);
        expect(response.text).toContain('Alpine Panorama Express');
    });
    test('unknown detail returns 404', async () => {
        expect((await request(app).get('/trips/not-a-trip')).status).toBe(404);
    });
    test('schema rejects missing id and negative distance', () => {
        const error = new Trip({ distance: -1 }).validateSync();
        expect(error.errors).toHaveProperty('id');
        expect(error.errors).toHaveProperty('distance');
    });
    test('Swagger UI is served', async () => {
        const response = await request(app).get('/api-docs/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Swagger UI');
    });
});
