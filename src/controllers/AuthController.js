import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import qs from 'query-string';
import db from '../models/index.js'
import { JWT_SECRET } from '../middlewares/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize'; 
const User = db.User
const RefreshToken = db.RefreshToken
const createRefreshToken = async (user) => {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 604800)
    const token = uuidv4();
    const refreshToken = await RefreshToken.create({
        token: token,
        userId: user.id,
        expiresAt: expiresAt.getTime()

    })
    return refreshToken.token



}




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
            };
    
            
            const token = jwt.sign(
                { user: JSON.stringify(payload) },
                JWT_SECRET,
                { expiresIn: '15m', }
            )
            console.log('login')
            const refreshToken = await createRefreshToken(user)
            console.log('Token: ', refreshToken)
            return res.status(200).json({data: {user: payload, token, refreshToken}})

        } catch (error) {
            return res.status(500).json({message: "Login error", error})
        }  
    },
    async refreshToken(req, res) {
        const { requestToken } = req.body;
        if (!requestToken) {
            return res.status(403).json({ message: "Refresh token is needed" })
        }
        try {
            const refreshToken = await RefreshToken.findOne({ where: { token: requestToken } })
            if (!refreshToken) {
                return res.status(403).json({ message: "Refresh token does not exist in the database" })
            }
            if (RefreshToken.verifyExpiration(refreshToken)) {
                RefreshToken.destroy({ where: { id: refreshToken.id } })
                
                return res.status(403).json({
                    message: "Refresh Token has expired. Please, log in again"
                })
            }
            
            const user = await User.findByPk(refreshToken.userId)
            await RefreshToken.destroy({ where: { id: refreshToken.id } });
            const newRefreshToken = await createRefreshToken(user);
            
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            }
            const newAccessToken = jwt.sign({ user: JSON.stringify(payload) }, JWT_SECRET, {
                expiresIn: "15m"
            })

            return res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });


        } catch (err) {
            return res.status(500).send({ message: err })
        }
    },


        async logout(req, res) {
        try {
            console.log('logout')
            const { requestToken } = req.body;
            console.log(requestToken)
            if (!requestToken) {
                return res.status(400).json({ message: "Refresh Token is required to logout" })
            }
            await RefreshToken.destroy({ where: { token: requestToken } });
            return res.status(200).json({ message: "Logout successful" })
        } catch (err) {
            console.error("ERRO NO LOGOUT:", err);
            return res.status(500).send({ message: err })
        }

    }

    }


