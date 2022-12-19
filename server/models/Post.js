const sequelize = require('../config/database/db')
const {DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')

const Post = sequelize.define('posts', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {len: {args: [6], msg: 'at least six characters'}}
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {len: {args: [6], msg: 'at least six characters'}}
        },
        rating: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        allRatings: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        votersCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

    }, {
        underscored: true,

    }
)


module.exports = Post