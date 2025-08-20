const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'JYS Media Admin',
            email: process.env.ADMIN_EMAIL || 'admin@jysmedia.com',
            password: process.env.ADMIN_PASSWORD || 'Admin123!',
            role: 'admin'
        });

        console.log('Admin user created successfully:');
        console.log('Email:', admin.email);
        console.log('Password:', process.env.ADMIN_PASSWORD || 'Admin123!');
        console.log('Role:', admin.role);

    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        mongoose.disconnect();
        process.exit(0);
    }
};

seedAdmin();
