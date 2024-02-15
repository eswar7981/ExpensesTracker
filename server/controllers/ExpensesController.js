const path = require("path");
require("dotenv").config();

const Expenses = require("../models/Expenses");
const User = require("../models/User");
const { use } = require("../routes/autentication");
const jwt = require("jsonwebtoken");
const razor = require("razorpay");
const Orders = require("../models/Orders");
const sequelize = require("../util/database");
const AWS = require("aws-sdk");
const { setTimeout } = require("timers/promises");
const PreviousFiles = require("../models/PreviousFiles");

exports.AddExpense = async (req, res) => {
  const trans = await sequelize.transaction();
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  const token = req.body.token;

  console.log(token);
  const id = jwt.verify(token,`${process.env.SECRET_KEY}`);

  const user = await User.findByPk(id.userId).then((user) => {
    user.update(
      {
        totalExpenses: parseInt(user.totalExpenses) + parseInt(amount),
      },
      { transaction: trans }
    );
  });

  const expense = await Expenses.create(
    {
      moneySpent: amount,
      description: description,
      category: category,
      UserId: id.userId,
    },
    { transaction: trans }
  );

  const addedExpense = await expense;
  

  const getExpense = await Expenses.findAll(
    {
      where: {
        UserId: id.userId,
      },
    },
    { transaction: trans }
  );
  try {
    const getExpenseData = await getExpense;

    res.json(getExpenseData);
    trans.commit();
  } catch (err) {
    trans.rollback();
    console.log(err);
  }
};

exports.getExpenses = (req, res) => {
  const token = req.headers.token;
  console.log(token);
  const id = jwt.verify(token,`${process.env.SECRET_KEY}`);
  console.log("get expenses", id.userId);
  Expenses.findAll({
    where: {
      UserId: id.userId,
    },
  }).then((data) => {
    
    res.json(data);
  });
};

exports.deleteExpenses = async (req, res) => {
  const trans = await sequelize.transaction();
  const itemId = req.headers.id;
  const userId = req.headers.user;
  const amount = req.headers.amount;

  const user = await User.findByPk(userId).then((user) => {
    user.update(
      { totalExpenses: parseInt(user.totalExpenses) - amount },
      { transaction: trans }
    );
  });

  const deleteExpense = await Expenses.destroy(
    {
      where: {
        UserId: userId,
        id: itemId,
      },
    },
    { transaction: trans }
  );

  const expenses = await Expenses.findAll(
    {
      where: {
        UserId: userId,
      },
    },
    { transaction: trans }
  );

  const expenseData = await expenses;
  try {
    trans.commit();
    res.json(expenseData);
  } catch (err) {
    console.log(err);
    trans.rollback();
  }
};

exports.handlePayment = (req, res) => {
  const token = req.headers.token;
  const id = jwt.verify(token,`${process.env.SECRET_KEY}`);

  var rzp = new razor({
    key_id:`${process.env.RZP_ID}`,
    key_secret:`${process.env.RZP_KEY}`,
  });

  const amount = 100;

  rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
    if (err) {
      console.log(err);
      throw new Error(JSON.stringify(err));
    }

    User.findByPk(id.userId).then((data) => {
      return Orders.create({
        orderId: order.id,
        status: "PENDING",
        UserId: id.userId,
      }).then(() => {
        return res.json({ order, key_id: rzp.key_id });
      });
    });
  });
};

exports.updateStatus = (req, res) => {
  const token = req.headers.token;
  const orderId = req.headers.order_id;
  const paymentId = req.headers.payment_id;

  const id = jwt.verify(token,`${process.env.SECRET_KEY}`);
  Orders.findOne({
    where: {
      orderId: orderId,
    },
  }).then((order) => {
    order.update({ paymentId: paymentId, status: "Succesful" }).then(() => {
      User.findOne({
        where: {
          id: id.userId,
        },
      }).then((user) => {
        user.update({ premiumUser: true });
        res.json("success");
      });
    });
  });
};

exports.sendCurrentPageData = (req, res) => {
  const token = req.headers.token;
  const pageNo = parseInt(req.headers.page);
  console.log(pageNo)
  const rows = parseInt(req.headers.rows);
  const id = jwt.verify(token,`${process.env.SECRET_KEY}`);
  Expenses.findAll({
    where: {
      UserId: id.userId,
    },
  }).then((expen) => {
    const expens = expen.slice(0, expen.length).reverse();
    const expenses = expens.slice(10, expens.length);
    if (
      expenses.slice(pageNo * rows, (pageNo + 1) * rows).length < rows &&
      expenses.slice(pageNo * rows, (pageNo + 1) * rows).length !== 0
    ) {
      res.json({
        expenses: expenses.slice(pageNo * rows, (pageNo + 1) * rows),
        nextPage: false,
        beforePage: true,
      });
    }
    if (expenses.slice(pageNo * rows, (pageNo + 1) * rows).length === rows) {
      console.log(expenses.slice(0 * rows, (0 + 1) * rows))
      res.json({
        expenses: expenses.slice(pageNo * rows, (pageNo + 1) * rows),
        nextPage: true,
        beforePage: true,
      });
    }
  });
};

exports.downloadExpenses = async (req, res) => {
  console.log(process.env.IAM_USER_KEY)
  const BUCKET_NAME = `${process.env.BUCKET_NAME}`;
  const IAM_USER_KEY = `${process.env.IAM_USER_KEY}`;
  const IAM_USER_SECRET = `${process.env.IAM_USER_SECRET}`;
  const token = req.headers.token;
  const id = jwt.verify(token,`${process.env.SECRET_KEY}`);

  function uploadToAWSs3(data, fileName, ids) {
    let s3bucket = new AWS.S3({
      accessKeyId:`${process.env.IAM_USER_KEY}`,
      secretAccessKey: `${process.env.IAM_USER_SECRET}`,
    });

    var params = {
      Bucket:process.env.BUCKET_NAME,
      Key: fileName,
      Body: data,
      ACL: "public-read",
    };

    s3bucket.upload(params, (err, resp) => {
      if (err) {
        console.log(err);
        res.json({ upload: "failed" });
      } else {
      
        const Location = resp.Location;

        PreviousFiles.create({ file: Location, UserId: ids });
        res.json({ file: Location, upload: "success" });
      }
    });
  }

  const expenses = await Expenses.findAll({
    where: {
      UserId: id.userId,
    },
  });
  const stringifyExpenses = JSON.stringify(expenses);
  const fileName = `expenses${id.userId}/${new Date()}.txt`;
  const file = uploadToAWSs3(stringifyExpenses, fileName, id.userId);
};

exports.getAllDownloadedFiles = async (req, res) => {
  const token = req.headers.token;
  const id = jwt.verify(token,`${process.env.SECRET_KEY}`);
  const prevFiles = await PreviousFiles.findAll({
    where: {
      UserId: id.userId,
    },
  });
  res.json({ files: prevFiles });
};
