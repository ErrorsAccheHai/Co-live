require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/user', require('./src/routes/user'));
app.use('/api/request', require('./src/routes/request'));
app.use('/api/property', require('./src/routes/property'));
app.use('/api/admin', require('./src/routes/admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
