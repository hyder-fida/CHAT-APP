const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require("./routes/userRoutes");
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();
require("dotenv").config();

// Middleware
app.use(cors());
app.use(helmet()); // Security middleware
app.use(morgan('combined')); // Logging middleware
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected successfully!");
}).catch((err) => {
    console.log("MongoDB connection error:", err.message);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close();
        process.exit(0);
    });
});
