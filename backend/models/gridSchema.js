
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gridSchema = new mongoose.Schema({
    user: { type: String, required: true},
    grid_name: { type: String, required: true },
    grid_type: { type: String, default: 'everyday' },
    priority: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grid', gridSchema);