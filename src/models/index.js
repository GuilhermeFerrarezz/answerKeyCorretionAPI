import sequelize from "../config/database.js";
import User from './User.js';
import Result from "./Result.js";
import RefreshToken from "./RefreshToken.js";

User.hasOne(RefreshToken, {
    foreignKey: 'userId',
    onDelete: "CASCADE"
});

RefreshToken.belongsTo(User,
    {
        foreignKey: "userId"      
    });



User.hasMany(Result, {
    onDelete: "CASCADE"
})
Result.belongsTo(User)



const db = {
    sequelize, 
    User, 
    Result,
    RefreshToken
}
export default db
