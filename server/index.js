import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js'
import { errorHandler } from './middleware/errorHandler.js';
import cookiePaser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

mongoose.connect(
    process.env.MONGO_URI
).then(() => console.log("db is connected")).catch((err) => console.log('Error connection db', err))


app.use(express.json());
app.use(cookiePaser());
app.use(fileUpload());
app.use(express.static('static'));
app.use("/static", express.static(path.join(__dirname, "static")));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

app.use(errorHandler)

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});
