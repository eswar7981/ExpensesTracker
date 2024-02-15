const sequelize=require('../util/database')
const Sequelize=require('sequelize')

const ForgotPasswordRequests=sequelize.define('ForgotPasswordRequests',{
    id:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:true
    },
    UserId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    isActive:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    }
})

module.exports=ForgotPasswordRequests