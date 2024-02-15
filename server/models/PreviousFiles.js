const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const PreviousFiles = sequelize.define("PreviousFiles", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  file: {
    type: Sequelize.STRING,
  },
  
});

module.exports = PreviousFiles;
