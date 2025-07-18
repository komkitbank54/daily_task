//task
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
    user: { type: String, required: true },
    grid: { type: String, required: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: Number, default: 0 },
    todayCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);