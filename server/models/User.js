const sequelize=require('../util/database')
const Sequelize=require('sequelize')

const User=sequelize.define('User',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },emailAddress:{
        type:Sequelize.STRING,
        allowNull:false
    },password:{
        type:Sequelize.STRING,
        allowNull:false
    },premiumUser:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    },totalExpenses:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }
})

module.exports=User