import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import './models/index.js';
dotenv.config()
const app = express();
app.use(cors())
app.use(express.json())
app.get("/", (_, res) => res.status(200).json({ message: "API enabled" }));

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Database successfuly sync")
    } catch (error) {
        console.error("Failed to connect to database ", error)
    }
})()
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log('Server running on port ', PORT)
}) 