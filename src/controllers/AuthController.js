import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import qs from 'query-string';
import db from '../models/index.js'
import { JWT_SECRET } from '../middlewares/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize'; 
const User = db.User



export default {
    async register(req, res) {
        try {
    
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ message: "Incomplete data" })
            }
            const userExists = await User.findOne({ where: { email } })
            if (userExists) {
                return res.status(400).json({ message: "Email already registered" })
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                name,
                email,
                password: hashedPassword
            })
            return res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email
            });

        } catch (error) {
            return res.status(500).json({
                message: "Error while registering user", error
            })
    
        }
    },

    async login(req, res) {
        try {
            console.log(req.body)
            const { email, password } = req.body
            if (!email || !password) {
                return res.status(400).json({message: "Enter email and password"})
            }
            const user = await User.findOne({ where: { email } });
            if (!user || !user.password) {
                return res.status(401).json({ message: "Invalid credentials"})
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({message: "Invalid credentials"})
            }
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            };
            const token = jwt.sign({ user: JSON.stringify(payload) }, JWT_SECRET, {
                expiresIn: "60m"
            });
            return res.status(200).json({data: {user: payload, token}})

        } catch (error) {
            return res.status(500).json({message: "Login error", error})
        }  
    }

}

