import mongoose from 'mongoose';
const tripSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    region: { type: String, required: true },
    startStation: { type: String, required: true },
    endStation: { type: String, required: true },
    duration: { type: String, required: true },
    distance: { type: Number, required: true, min: 0 },
    highlights: { type: [String], default: [] },
    bestSeason: { type: String, required: true },
    operatingMonths: { type: [{ type: Number, min: 1, max: 12, validate: Number.isInteger }], default: [] },
    imageUrl: String
}, { collection: 'trips', versionKey: false });
export default mongoose.model('Trip', tripSchema);
