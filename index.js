const express = require('express');
const db = require('./db')
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()
const port= 5000
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.use('/api/auth',require('./routes/auth'))
app.use('/api/todo',require('./routes/todo'))

app.listen(port,()=> {
console.log(`Server running succesfully at http://localhost:${port}/`)
})