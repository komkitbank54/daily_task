//task
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
    user: { type: String, required: true }, // changed from user (ObjectId) to username (String)
    title: { type: String, required: true },
    description: { type: String, required: true },
    todayCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);