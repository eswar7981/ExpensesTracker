const sequelize=require('../util/database')
const Sequelize=require('sequelize')

const Orders=sequelize.define('Orders',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    orderId:{
        type:Sequelize.STRING,
        allowNull:false,
      
    },
    paymentId:Sequelize.STRING
    ,
    status:{
        type:Sequelize.STRING,
      
        allowNull:false
    }

})

module.exports=Orders