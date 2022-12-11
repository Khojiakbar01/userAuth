const sequelize = require('../config/database/db')
const {DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')

const User = sequelize.define('users', {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
            allowNull:false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {len: {args: [6], msg: 'at least six characters'}}

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

module.exports = User