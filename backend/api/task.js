const express = require('express');
const router = express.Router();
const Task = require('../models/taskSchema');
const User = require('../models/userSchema');
const Grid = require('../models/gridSchema');

// CREATE a new task
router.post('/tasks', async (req, res) => {
    // Find the highest current priority for this user
    let nextPriority = 0;
    if (req.body.user) {
        const lastTask = await Task.findOne({ user: req.body.user }).sort({ priority: -1 });
        if (lastTask && typeof lastTask.priority === 'number') {
            nextPriority = lastTask.priority + 1;
        }
    }

    const task = new Task({
        user: req.body.user,
        grid: req.body.grid,
        title: req.body.title,
        description: req.body.description,
        todayCompleted: req.body.completed,
        priority: nextPriority
    });

    // Check for required fields
    if (!task.user || !task.title || !task.description || !task.grid) {
        return res.status(400).json({ message: 'User, title, grid, and description are required' });
    }

    const existingUser = await User.findOne({ username: task.user });
    if (!existingUser) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    const existingGrid = await Grid.findOne({ grid_name: task.grid });
    if (!existingGrid) {
      return res.status(400).json({ message: 'Grid does not exist'});
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
router.put('/tasks', async (req, res) => {
  try {
    const {id, grid} = req.query;

    const task = await Task.findOne({ _id: id, grid: grid });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.grid !== undefined) task.grid = req.body.grid;
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.priority !== undefined) task.priority = req.body.priority;
    if (req.body.completed !== undefined) task.completed = req.body.completed;
    if (req.body.todayCompleted !== undefined) task.todayCompleted = req.body.todayCompleted;

    const updatedTask = await task.save();
    console.log('Task updated:', updatedTask);
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// DELETE task by ID (query param) or all tasks
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;