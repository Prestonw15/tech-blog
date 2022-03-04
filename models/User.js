const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcryptjs');
const { beforeCreate, beforeUpdate } = require('./Comment');


class User extends Model {
    // this will set up a quick method to check passwords
    checkPassword(loginPsw) {
        return bcrypt.compareSync(loginPsw, this.password);
    }
}

//define table columns
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // This will set the min for the password length
                len: [8]
            }
        }
    },
    {
        hooks: {
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            async beforeUpdate(updateUserData) {
                updateUserData.password = await bcrypt.hash(updateUserData.password, 10);
                return updateUserData;
            }
        },

        sequelize,
        // stops from auto creation for timestamp fields
        timestamps: false,
        freezeTableName: true,
        // uses underscores instead of camel-casing
        underscored: true,
        // make model name stay in lowercasing
        modelName: 'user'
    }
);


module.exports = User;