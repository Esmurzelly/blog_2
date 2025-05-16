import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

mongoose.connect(
    process.env.MONGO_URI
).then(() => console.log("db is connected")).catch((err) => console.log('Error connection db', err))

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});

app.use(errorHandler)