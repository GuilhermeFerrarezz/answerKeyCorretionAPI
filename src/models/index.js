import sequelize from "../config/database.js";
import User from './User.js';
import RefreshToken from "./RefreshToken.js";
import Resposta from "./Resposta.js";
import Prova from "./Prova.js";

User.hasOne(RefreshToken, {
    foreignKey: 'userId',
    onDelete: "CASCADE"
});

RefreshToken.belongsTo(User,
    {
        foreignKey: "userId"      
    });



User.hasMany(Prova, {
    onDelete: "CASCADE",
    foreignKey: 'userId',
    onDelete: "CASCADE"
})
Prova.belongsTo(User, 
    {
    foreignKey: 'userId'
}
)

Prova.hasOne(Resposta, {foreignKey: 'provaId', onDelete: "CASCADE", as: 'resposta'})
Resposta.belongsTo(Prova, {foreignKey: 'provaId', as: 'prova'})




const db = {
    sequelize, 
    User, 
    Prova, 
    Resposta,
    RefreshToken
}
export default db
