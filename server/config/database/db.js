const {Sequelize} = require('sequelize')

const variables = process.env

const dbConfig = {
    host: variables.DB_HOST,
    port: variables.DB_PORT,
    database: variables.DB_NAME,
    username: variables.DB_USER,
    password: variables.DB_PASSWORD,
    dialect: variables.DB_DIALECT
}

const db = new Sequelize(dbConfig)

module.exports = db