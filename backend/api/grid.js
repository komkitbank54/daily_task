const express = require('express');
const router = express.Router();
const Grid = require('../models/gridSchema');
const User = require('../models/userSchema');

// GET all grid by user
router.get('/grids', async (req, res) => {
    try {
        let query = {}
        if (req.query.user) {
            query.user = req.query.user;
        }
        const grids = await Grid.find(query).sort({ priority: 1})
        res.json(grids);
    } catch (err) {
        res.status(500).json ({message: err.message});
    }
});


//Create new grid
router.post('/grids', async (req, res) => {
        // console.log(`req = ${req.body} res= ${res.locals}`);
        let nextPriority = 0;
        if (req.body.user) {
            const lastGrid = await Grid.findOne({user: req.body.user}).sort({ priority: -1});
            if (lastGrid && typeof lastGrid.priority === 'number') {
                nextPriority = lastGrid.priority + 1;
            }
        }
        const grid = new Grid({
            user: req.body.user,
            grid_name: req.body.grid_name,
            grid_type: req.body.grid_type,
            priority: nextPriority
        });

        //Check for required value fields
        if (!grid.user || !grid.grid_name) {
            const missingFields = [];
            if (!grid.user) missingFields.push('User');
            if (!grid.grid_name) missingFields.push('Grid Name');
            return res.status(400).json({ message: `${missingFields.join(' and ')} required` });
        }

        const existingUser = await User.findOne({ username: grid.user});
        if (!existingUser) {
            return res.status(400).json({ message: 'User does not exist'});
        }
        try {
            const newGrid = await grid.save();
            res.status(201).json(newGrid);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

module.exports = router;