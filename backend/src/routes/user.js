const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get profile
router.get('/me', auth, async (req,res)=>{
  const user = await User.findById(req.user.userId).select('-password');
  res.json(user);
});

// Update profile
router.put('/me', auth, async (req,res)=>{
  const { name, password } = req.body;
  const updates = {};
  if(name) updates.name = name;
  if(password){
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(password, salt);
  }
  const user = await User.findByIdAndUpdate(req.user.userId, updates, { new:true }).select('-password');
  res.json(user);
});

module.exports = router;
