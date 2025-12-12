const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');

// -------------------
// GET
// -------------------
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // default page 1
        const limit = 10; // 10 items per page
        const skip = (page - 1) * limit;

        const restaurants = await Restaurant.find().skip(skip).limit(limit);
        const total = await Restaurant.countDocuments();

        res.json({
            page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: restaurants
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------
// POST
// -------------------
router.post('/', async (req, res) => {
    try {
        const newRestaurant = new Restaurant(req.body);
        const savedRestaurant = await newRestaurant.save();
        res.status(201).json(savedRestaurant);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// -------------------
// DELETE
// -------------------
router.delete('/:_id', async (req, res) => {
    try {
        const deleted = await Restaurant.findByIdAndDelete(req.params._id);
        if (!deleted) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.json({ message: 'Restaurant deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
