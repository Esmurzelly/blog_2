import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import { errorHandler } from './middleware/errorHandler.js';
import cookiePaser from 'cookie-parser';

dotenv.config();

mongoose.connect(
    process.env.MONGO_URI
).then(() => console.log("db is connected")).catch((err) => console.log('Error connection db', err))

const app = express();

app.use(express.json());
app.use(cookiePaser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler)

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});
