import { getDb } from '../db/connect.js';
import { getTripById as findTripById, getAllTrips as findAllTrips } from '../models/trips.js';

export const getAllTrips = async (req, res) => {
    try {
        return res.status(200).json({ trips: await findAllTrips() });
    } catch (error) {
        console.error('Error fetching trips:', error.message);
        return res.status(500).json({ error: 'Failed to fetch trips' });
    }
};
export const getTripById = async (req, res) => {
    try {
        const trip = await findTripById(req.params.id);
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        return res.status(200).json(trip);
    } catch (error) {
        console.error('Error fetching trip:', error.message);
        return res.status(500).json({ error: 'Failed to fetch trip' });
    }
};
export const listTripsPage = (req, res) => {
    return res.render('trips/list', { title: 'Scenic Train Trips' });
};
export const tripDetailsPage = async (req, res, next) => {
    try {
        const { tripId } = req.params;
        const details = await findTripById(tripId);
        if (!details) {
            const error = new Error('Trip not found');
            error.status = 404;
            return next(error);
        }
        // Preserve schedules until Feature Set 2 replaces this legacy query.
        details.schedules = await getDb().collection('schedules').find({ tripId }).toArray();
        return res.render('trips/details', { title: 'Trip Details', details });
    } catch (error) {
        return next(error);
    }
};
