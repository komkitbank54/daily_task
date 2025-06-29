require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./api/task");
const userRoutes = require("./api/user");

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", taskRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// connect to MongoDB
mongoose
    .connect(process.env.MongoURI, {})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
