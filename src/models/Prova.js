import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"


const Prova = sequelize.define("Prova", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    mes: {
        type: DataTypes.INTEGER
    },

    ano: {
        type: DataTypes.INTEGER
    },
    dia: {
        type: DataTypes.INTEGER
    },


});
export default Prova;