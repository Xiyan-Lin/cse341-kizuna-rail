import Trip from './schemas/trips.js';
export const getTripById = async (id) => Trip.findOne({ id }, { _id: 0 }).lean();
export const getAllTrips = async () => Trip.find({}, { _id: 0 }).lean();
