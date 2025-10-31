require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedAdmin = async () => {
    try {
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'ashishbharti9598@gmail.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('Admin123', 10);

        const admin = new User({
            name: 'Admin',
            email: 'ashishbharti9598@gmail.com',
            password: hashedPassword,
            role: 'admin',
            isVerified: true,
            phoneNumber: '0000000000', // Default phone number
            verified: true
        });

        await admin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();