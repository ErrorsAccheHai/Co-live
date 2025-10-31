const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Get all properties (public)
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find({ status: 'approved', isAvailable: true })
            .populate('owner', 'name email');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get property by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('owner', 'name email');
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create property (landlord only)
router.post('/', auth, roleCheck('landlord'), async (req, res) => {
    try {
        const property = new Property({
            ...req.body,
            owner: req.user._id,
        });
        const newProperty = await property.save();
        res.status(201).json(newProperty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update property (landlord only - their own properties)
router.put('/:id', auth, roleCheck('landlord'), async (req, res) => {
    try {
        const property = await Property.findOne({ 
            _id: req.params.id,
            owner: req.user._id
        });

        if (!property) {
            return res.status(404).json({ message: 'Property not found or unauthorized' });
        }

        Object.assign(property, req.body);
        const updatedProperty = await property.save();
        res.json(updatedProperty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete property (landlord only - their own properties)
router.delete('/:id', auth, roleCheck('landlord'), async (req, res) => {
    try {
        const property = await Property.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!property) {
            return res.status(404).json({ message: 'Property not found or unauthorized' });
        }

        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin routes for property verification
// Get pending properties (admin only)
router.get('/admin/pending', auth, roleCheck('admin'), async (req, res) => {
    try {
        const properties = await Property.find({ status: 'pending' })
            .populate('owner', 'name email');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Verify property (admin only)
router.put('/admin/verify/:id', auth, roleCheck('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        property.status = status;
        if (status === 'approved') {
            property.isVerified = true;
            property.verifiedBy = req.user._id;
            property.verifiedAt = new Date();
        }

        const updatedProperty = await property.save();
        res.json(updatedProperty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;