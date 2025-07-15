const express = require('express');
const router = express.Router();
const Task = require('../models/taskSchema');
const User = require('../models/userSchema');

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
        title: req.body.title,
        description: req.body.description,
        todayCompleted: req.body.completed,
        priority: nextPriority
    });

    // Check for required fields
    if (!task.user || !task.title || !task.description) {
        return res.status(400).json({ message: 'User, title, and description are required' });
    }

    const existingUser = await User.findOne({ username: task.user });
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
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // แก้เฉพาะ field ที่ส่งมา
    if (req.body.title !== undefined) task.title = req.body.title;
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
    const { id } = req.query;

    if (id) {
      // เช็คว่าเป็น ObjectId ที่ valid
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid task ID' });
      }

      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ message: 'Task not found' });

      await task.deleteOne();
      return res.json({ message: 'Task deleted successfully' });
    }

    // ไม่มี id → ลบทั้งหมด
    await Task.deleteMany({});
    res.json({ message: 'All tasks deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;