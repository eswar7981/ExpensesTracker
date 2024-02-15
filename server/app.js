const express=require('express')
const cors=require('cors')

const helmet=require('helmet')
const dotenv=require('dotenv')
dotenv.config({path:'./util/.env'})
const app=express()
const User=require('./models/User')
const Expenses=require('./models/Expenses')
const Authroutes=require('./routes/autentication')
const ExpenseRoutes=require('./routes/expenses')
const sequelize = require('./util/database')
const Order=require('./models/Orders')
const PreviousFiles = require('./models/PreviousFiles')
const ForgotPassword=require('./models/ForgotPasswordRequests')
const compression=require('compression')
const morgan=require('morgan')
const fs=require('fs')
const path=require('path')
const accessLog=fs.createWriteStream(path.join(__dirname,'access.log'),
{flags:'a'
})


app.use(helmet())
app.use(morgan('combined',{stream:accessLog}))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/autentication',Authroutes)
app.use('/expenses',ExpenseRoutes)




User.hasMany(Expenses)
Expenses.belongsTo(User)
User.hasMany(Order)
Order.belongsTo(User)
User.hasMany(PreviousFiles)
PreviousFiles.belongsTo(User)
User.hasMany(ForgotPassword)
ForgotPassword.belongsTo(User)


sequelize.sync(

).then(()=>{
    app.listen(5000)
})
