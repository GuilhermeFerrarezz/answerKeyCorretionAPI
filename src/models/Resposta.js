import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"


const Resposta = sequelize.define("Resposta", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true,
    },
    respostas_usuario: {
        type: DataTypes.JSON,
        allowNull: false
    },
    respostas_gabarito: {
        type: DataTypes.JSON,
        allowNull: false
    } 

    
});
export default Resposta;