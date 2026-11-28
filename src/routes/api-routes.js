import { Router } from 'express';
import { trainsApi } from './trains.js';
import { getAllTrips, getTripById } from '../controllers/trips.js';

const router = Router();
/**
 * @openapi
 * /api/trips:
 *   get:
 *     tags: [Trips]
 *     summary: List trips
 *     responses:
 *       '200':
 *         description: All trips
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [trips]
 *               properties:
 *                 trips:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 *       '500':
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/api/trips', getAllTrips);
/**
 * @openapi
 * /api/trips/{id}:
 *   get:
 *     tags: [Trips]
 *     summary: Get trip by public ID
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       example: alpine-panorama
 *     responses:
 *       '200':
 *         description: Matching trip
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       '404':
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/api/trips/:id', getTripById);
router.get('/api/trains', trainsApi);
export default router;
