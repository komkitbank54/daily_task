const express = require('express');
const router = express.Router();
const Task = require('../models/taskSchema');
const User = require('../models/userSchema');

// CREATE a new task
router.post('/tasks', async (req, res) => {
    const task = new Task({
        user: req.body.user,
        title: req.body.title,
        description: req.body.description,
        todayCompleted: req.body.completed
    });

    // Check for required fields
    if (!task.user || !task.title || !task.description) {
        return res.status(400).json({ message: 'User, title, and description are required' });
    }

    const existingUser = await User.findOne({ username: task.user })
    if (!existingUser) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all tasks or tasks by user
router.get('/tasks', async (req, res) => {
    try {
        let query = {};
        if (req.query.user) {
            query.user = req.query.user;
        }
        const tasks = await Task.find(query).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// EDIT a task by id
router.put('/tasks/edit=:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// DELETE a task by id
router.delete('/tasks/delete', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        await task.
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;