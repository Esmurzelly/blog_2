import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(
    process.env.MONGO_URI
).then(() => console.log("db is connected")).catch((err) => console.log('Error connection db', err))

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})