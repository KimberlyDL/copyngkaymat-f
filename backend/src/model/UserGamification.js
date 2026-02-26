// backend/src/model/UserGamification.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class UserGamification extends Model {}

    UserGamification.init({
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: { model: 'Users', key: 'id' }
        },
        experience_points: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        level: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        streak: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'UserGamification',
        tableName: 'usergamification', // FIX: Ito ang itutugma natin sa database mo
        underscored: true,
        timestamps: true
    });

    return UserGamification;
};