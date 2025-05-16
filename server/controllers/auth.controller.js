import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { createError } from '../utils/error.js';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        // return res.status(400).json({ message: "All field are required" });
        next(createError(400, "All field are required"))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.json("SignUp successfull");
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}