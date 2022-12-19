const sequelize = require('../config/database/db')
const {DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')
const Post = require('./Post')


const User = sequelize.define('users', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {len: {args: [6], msg: 'at least six characters'}}
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {isEmail: {args: true, msg: 'please enter a valid email'}}
        },
    }, {
        underscored: true,
        hooks: {
            async beforeCreate(user) {
                user.password = await bcrypt.hash(user.password, 8)
            }
        }

    }
)

User.hasMany(Post, {as: "post", onDelete: "cascade"})
Post.belongsTo(User, {as: 'user'})

module.exports = User