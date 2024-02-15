const sequelize=require('../util/database')
const Sequelize=require('sequelize')

const Expenses=sequelize.define('Expenses',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    moneySpent:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    description:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false
    },

})

module.exports=Expenses