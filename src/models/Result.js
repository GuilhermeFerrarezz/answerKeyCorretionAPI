import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"


const Result = sequelize.define("Result", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nameTest: DataTypes.STRING,
    result: DataTypes.STRING,
});
export default Result;