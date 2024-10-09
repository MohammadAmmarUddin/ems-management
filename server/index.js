const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const port = 5000;
const app = express()
const authRouter = require('../server/Routes/authRouter')
app.use(cors())
app.use(express.json())
mongoose.connect('mongodb+srv://safara:safara@cluster0.t9lecvs.mongodb.net/EMS?retryWrites=true&w=majority&appName=Cluster0')

app.post('/api/auth',authRouter)

app.get('/',async(req,res)=>{
    res.send('server is fine ems')
})

app.listen(console.log("port running", port))