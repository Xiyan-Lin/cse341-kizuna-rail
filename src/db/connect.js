import mongoose from 'mongoose';

let database;
const connectToDb = async (options = {}) => {
    if (database) return database;
    const connectionString = options.connectionString || process.env.MONGODB_URI;
    const databaseName = options.databaseName || process.env.MONGODB_DB_NAME || 'practice';
    if (!connectionString) throw new Error('MONGODB_URI is required.');
    await mongoose.connect(connectionString, { dbName: databaseName, serverSelectionTimeoutMS: 10000 });
    database = mongoose.connection.db;
    return database;
};
const getDb = () => {
    if (!database) throw new Error('Database not initialized. Call connectToDb first.');
    return database;
};
const closeDb = async () => {
    try { await mongoose.disconnect(); } finally { database = undefined; }
};
export { closeDb, connectToDb, getDb };
