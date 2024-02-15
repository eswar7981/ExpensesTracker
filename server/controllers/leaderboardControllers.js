const Expenses = require("../models/Expenses");
const User = require("../models/User");
const { use } = require("../routes/autentication");
const jwt = require("jsonwebtoken");
const razor = require("razorpay");
const Orders = require("../models/Orders");

exports.showLeaderBoard = (req, res) => {
  User.findAll().then((data) => {
    res.json(data);
  });
};
