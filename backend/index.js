const express= require('express')
const cors= require('cors')
const connectDB = require('./config/db')
const router = require('./routes/index')
require('dotenv').config();
const cookieParser = require('cookie-parser')



const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
     origin : process.env.FRONTEND_URL,
     credentials : true   
}))
  


const PORT = 8080|| process.env.PORT


app.use("/api",router)

connectDB().then(()=>{
   app.listen(PORT,()=>{
      console.log("connected to DB")
      console.log("Server is running")
   })
})