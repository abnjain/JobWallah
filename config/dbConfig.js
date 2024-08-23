const mongoose = require("mongoose");
const dbgr = require("debug")("development:jobwallah/dbconfig")

// Replace with your MongoDB connection string
const dbURI = "mongodb://localhost:27017/jobwallah";

// Mongoose connection options
const options = {
    // useNewUrlParser: true, // Use the new MongoDB connection string parser
    // useUnifiedTopology: true, // Use the new topology engine
    // useCreateIndex: true, // To avoid deprecation warnings for collection.ensureIndex
    // useFindAndModify: false // To avoid deprecation warnings for findAndModify
};

// Connect to MongoDB
mongoose.connect(dbURI, options)
    .then(() => {
        dbgr("Connected to MongoDB successfully");
    })
    .catch((err) => {
        dbgr("Failed to connect to MongoDB", err);
    });

// Handle connection events
mongoose.connection.on("connected", () => {
    dbgr("Mongoose connected to " + dbURI);
});

mongoose.connection.on("error", (err) => {
    dbgr("Mongoose connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
    dbgr("Mongoose disconnected");
});

// Graceful shutdown
process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        dbgr("Mongoose disconnected through app termination");
        process.exit(0);
    });
});
