import sequelize from "../config/database.js";
import User from './User.js';
import Result from "./Result.js";

User.hasMany(Result, {
    onDelete: "CASCADE"
})
Result.belongsTo(User)


const db = {
    sequelize, 
    User, 
    Result
}
export default db
