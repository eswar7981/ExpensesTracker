const User = require("../models/User");
const { use } = require("../routes/autentication");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
const ForgotPasswordRequests = require("../models/ForgotPasswordRequests");
const { SharedIniFileCredentials } = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const { Transaction } = require("sequelize");

const generateToken = (id) => {
  return jwt.sign({ userId: id },`${process.env.SECRET_KEY}`);
};

exports.GetSignupDetails = (req, res) => {
  const name = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    where: {
      emailAddress: email,
    },
  })
    .then((data) => {
      console.log(data);
      if (data == null) {
        bcrypt.hash(password, 10, async (err, hash) => {
          await User.create({
            name: name,
            emailAddress: email,
            password: hash,
          });
        });
        res.json({message:"signup successful"});
      } else {
        res.json({ message: "email is already taken" });
      }
    })
    .catch(() => {});
};

exports.logOut = (req, res) => {
  res.json("logout");
  
};



exports.GetLoginDetails = (req, response) => {
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, 10, async (err, hash) => {
    User.findOne({
      where: {
        emailAddress: email,
      },
    })
      .then((res) => {
        bcrypt.compare(password, res.password, (err, resp) => {
          if (!err) {
            if (resp === true) {
            
              const token = generateToken(res.id);
             
              response.json({login:'success', token: token, premium: res.premiumUser });
            } else {
              response.json({login:'failed'});
             
            }
          }
        });
      })
      .catch((err) => {
        response.json({login:"user not found"});
        console.log(err);
      });
  });
};

exports.forgotPassword = (req, res) => {

  apiKey.apiKey =process.env.SIB_API_KEY
    
  const tranEmailApi = new Sib.TransactionalEmailsApi();

  User.findOne({
    where: {
      emailAddress: req.body.email,
    },
  })
    .then((data) => {
      const sender = {
        email: "eswarsatyavarapu7981@gmail.com",
      };
      const reciever = [
        {
          email: req.body.email,
        },
      ];

      const id = uuidv4();
      tranEmailApi
        .sendTransacEmail({
          sender,
          to: reciever,
          subject: "password change",
          textContent: "Change your Password",
          htmlContent: `<h4>Click Below link to change your password of Expense Tracker account</h4><a href="http://localhost:3000/autentication/resetPassword/${id}">Click Here</a>`,
        })
        .then((res) => {
          ForgotPasswordRequests.create({
            id: id,
            UserId: data.id,
            isActive: true,
          });
         
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: false });
    });
};

exports.resetPassword = (req, res) => {
  const idUser = req.params.id;

  ForgotPasswordRequests.findOne({
    where: {
      id: idUser,
      isActive: true,
    },
  })
    .then((request) => {
      res.json({ id: request.UserId });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.resetthePassword = (req, res) => {
  const password = req.body.password;
  const id = req.body.id;
  const uuid = req.body.uuid;
  console.log(password, id);
  User.findOne({
    where: {
      id: id,
    },
  })
    .then((user) => {
      bcrypt.hash(password, 10, async (err, hash) => {
        await user.update({ password: hash });
      });
    })
    .then(() => {
      ForgotPasswordRequests.findOne({
        where: {
          id: uuid,
        },
      })
        .then((request) => {
          request.update({ isActive: false });
        })
        .then(() => {
          res.json("successful");
        });
    });
};
