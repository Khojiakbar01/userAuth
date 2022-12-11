require('dotenv').config()
const db = require('./config/database/db')
const PORT = process.env.PORT || 7070
const app = require('./app')


//models
require('./user/User')



// const start =()=>{
//     try{
db.authenticate().then(() => {
    console.log('server authenticated')
    db.sync()
}).catch((error) => {
    console.log(error)
})



// }

app.listen(PORT, (req, res) => {
    console.log(`App is listening on PORT ${PORT}`)
})