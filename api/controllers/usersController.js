/*jshint -W014*/
import Shop from "../models/Shop";
import Transaction from "../models/Transactions";
const config = require("../config");
import User from "../models/User";
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var multer = require("multer");
import axios from "axios";
import RATES from "../models/payRates";
const Ravepay = require("flutterwave-node");
const rave = new Ravepay(
  process.env.PUBLIC_KEY,
  process.env.PRIVATE_KEY,
  false
);

// Register
export const register = [
  // validations rules
  body("surname", "Please enter your  Surname").isLength({ min: 1 }),
  body("country", "Please enter your  Country").isLength({ min: 1 }),
  body("firstname", "Please enter Firstname").isLength({ min: 1 }),
  body("email", "Please enter Email").isLength({ min: 1 }),
  body("email").custom(value => {
    return User.findOne({ email: value }).then(user => {
      if (user !== null) {
        return Promise.reject("Email already in use");
      }
    });
  }),
  body("password", "Please enter Password").isLength({ min: 1 }),

  function(req, res) {
    // throw validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    // initialize record
    var user = new User({
      name: { surname: req.body.surname, firstname: req.body.firstname },
      email: req.body.email,
      password: req.body.password,
      country: req.body.country,
      roles: [{ role: "buyer" }] //new users are given the role of buyers by default
    });

    // encrypt password
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;

    // save record
    user.save(function(err, user) {
      if (err) {
        return res.status(422).json({
          message: "Error saving record",
          error: err
        });
      }
      return res.json({
        message: "saved",
        _id: user._id,
        token: jwt.sign({ _id: user._id, email: user.email }, config.authSecret)
      });
    });
  }
];

export const promptPayment = async (req, res) => {
  let response = {
    status: "",
    message: ""
  };
  let country = req.body.country.toLowerCase();
  let abbr = [
    { nigeria: "NG" },
    { uk: "UK" },
    { kenya: "KE" },
    { ghana: "GH" }
  ].filter(x => Object.keys(x)[0] == country)[0][country];
  let extra;
  switch (req.query.type) {
    case "card":
      extra = await rave.Card.charge({
        cardno: req.body.card,
        cvv: req.body.cvv,
        expirymonth: req.body.card_month,
        expiryyear: req.body.card_year,
        currency: RATES.shop_opening_fee.currency,
        country: abbr,
        amount: RATES.shop_opening_fee.amount,
        email: req.body.email,
        firstname: req.body.firstname,
        suggested_auth: req.body.suggested_auth
          ? req.body.suggested_auth
          : null,
        pin: req.body.suggested_auth ? req.body.pin : null,
        lastname: req.body.lastname,
        IP: req.ip,
        txRef: "JUMGA-" + Date.now(), // your unique merchant reference
        meta: [
          {
            shop_name: req.body.shop_name,
            shop_description: req.body.shop_description
          }
        ],
        redirect_url: "",
        device_fingerprint: "69e6b7f0b72037aa8428b70fbe03986c"
      });
      extra = { ...extra.body };
      switch (extra.message) {
        case "AUTH_SUGGESTION":
          response.status = `needs_${extra.data.suggested_auth.toLowerCase()}`;
          response.message = "You need to put a pin for mastercard";
          break;
        case "V-COMP":
          response.status = `needs_otp`;
          response.message = extra.data.chargeResponseMessage;
          response.transaction_reference = extra.data.flwRef;
      }
      return res.json({ ...response, extra });
  }
};
//Register as merchant
export const registerAsMerchant = [
  // validations rules
  body("surname", "Please enter your  Surname").isLength({ min: 1 }),
  body("transaction_reference", "Transaction reference is required").isLength({
    min: 1
  }),
  body("transaction_reference").custom(value => {
    return Transaction.findOne({ ref: value }).then(transaction => {
      if (transaction !== null) {
        return Promise.reject("This transaction has already been settled");
      }
    });
  }),
  body("bank", "Please enter your  Bank").isLength({ min: 1 }),
  body("account_number", "Please enter your  Account number").isLength({
    min: 1
  }),
  body("country", "Please enter your  Country").isLength({ min: 1 }),
  body("firstname", "Please enter Firstname").isLength({ min: 1 }),
  body("email", "Please enter Email").isLength({ min: 1 }),
  body("email").custom(value => {
    return User.findOne({ email: value }).then(user => {
      if (user !== null) {
        return Promise.reject("Email already in use");
      }
    });
  }),
  body("shop_name", "Please enter your Shop's name ").isLength({ min: 1 }),
  body("shop_description", "Please enter your Shop's description ").isLength({
    min: 1
  }),
  body("password", "Please enter Password").isLength({ min: 1 }),

  function(req, res) {
    // throw validation errors
    let response = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    // verify the transaction before saving the user

    // initialize record
    var user = new User({
      name: { surname: req.body.surname, firstname: req.body.firstname },
      email: req.body.email,
      password: req.body.password,
      country: req.body.country,
      account: {
        account_number: req.body.account_number,
        bank: req.body.bank
      },
      roles: [{ role: "shop_owner" }] //new users are given the role of buyers by default
    });

    // encrypt password
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;

    // save record
    user.save(function(err, user) {
      if (err) {
        return res.status(422).json({
          message: "Error saving record",
          error: err
        });
      }
      // return res.json({
      //   message: "saved",
      //   _id: user._id,
      //   token: jwt.sign({ _id: user._id, email: user.email }, config.authSecret)
      // });
      let shop = new Shop({
        name: req.body.shop_name,
        description: req.body.shop_description, //
        owner: user._id,
        active: true
      });
      // save record
      shop.save(function(err, shop) {
        if (err) {
          return res.status(422).json({
            message: "Error saving record",
            error: err
          });
        }
        // save the user as a shop owner
        user = User.findById(user._id).then(user => {
          let has_role = false;
          [...user.roles].forEach(el => {
            if (el.role == "shop_owner") {
              has_role = true;
            }
          });
          if (!has_role) {
            user.roles = [...user.roles, { role: "shop_owner" }];
            user.save();
          }
        });

        return res.json({
          message: "saved",
          _id: shop._id
        });
      });
    });
  }
];

export const verifyTransaction = (req, res) => {
  let response = {};
  switch (req.body.type) {
    case "card":
      rave.Card.validate({
        transaction_reference: req.body.transaction_reference,
        otp: req.body.otp
      }).then(resp => {
        response.message = resp.body.message;
        response.status = resp.body.status;
        response.data = resp.body.data.tx;
        // check if this transaction has been settled before from our database
        return res.json({ res: response });
      });
  }
};

// Login
export const login = [
  // validation rules
  body("email", "Please enter Email").isLength({ min: 1 }),
  body("password", "Please enter Password").isLength({ min: 1 }),

  function(req, res) {
    // throw validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    // validate email and password are correct
    User.findOne({ email: req.body.email }, function(err, user) {
      if (err) {
        return res.status(500).json({
          message: "Error logging in",
          error: err
        });
      }

      if (user === null) {
        return res.status(500).json({
          message: "Email address you entered is not found."
        });
      }

      // compare submitted password with password inside db
      return bcrypt.compare(req.body.password, user.password, function(
        err,
        isMatched
      ) {
        if (isMatched === true) {
          return res.json({
            user: {
              _id: user._id,
              email: user.email,
              name: user.name
            },
            token: jwt.sign(
              { _id: user._id, email: user.email, name: user.name },
              config.authSecret
            ) // generate JWT token here
          });
        } else {
          return res.status(500).json({
            message: "Invalid Email or Password entered."
          });
        }
      });
    });
  }
];

//Logout
export const logout = (req, res) => {
  return res.status(200).json({
    logged: "out"
  });
};

// Get User
export const user = function(req, res) {
  var token = req.headers.authorization;
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token.replace(/^Bearer\s/, ""), config.authSecret, function(
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({ message: "unauthorized" });
      } else {
        // return res.json({ user: decoded });
        User.findOne({ email: decoded.email }, [
          "name",
          "email",
          "image",
          "roles",
          "shop"
        ])
          .populate("shop")
          .exec(async function(err, user) {
            if (err) {
              return res.status(500).json({
                message: "Error logging in",
                error: err
              });
            }
            return res.json({ user });
          });
      }
    });
  } else {
    return res.status(401).json({ message: "unauthorized" });
  }
};

export const getBanks = async (req, res) => {
  let country = req.query.country.toLowerCase();
  let abbr = [
    { nigeria: "NG" },
    { uk: "UK" },
    { kenya: "KE" },
    { ghana: "GH" }
  ].filter(x => Object.keys(x)[0] == country)[0][country];
  let banks;
  axios.defaults.headers.authorization = `Bearer ${process.env.PRIVATE_KEY}`;
  banks = await axios.get(`https://api.flutterwave.com/v3/banks/${abbr}`);
  return res.json({ banks: banks.data.data });
};

export const verifyBank = async (req, res) => {
  // Verify bank account is valid with flutterwave api

  // for some reason, this function is returning
  //   {
  //     "status": "error",
  //     "message": "Sorry, recipient account could not be validated. Please try again",
  //     "data": null
  // } after trying with several account numbers, seems it works for only the test accounts
  let result = { status: true };
  // axios.post(`https://api.flutterwave.com/v3/accounts/resolve`, {
  //   account_number: req.body.account_number,
  //   account_bank:req.body.account_bank
  // })
  // .then(resp => result = resp.data)
  // .catch(error=> {
  //   result = error
  //   console.log(error)
  // })
  return res.json({ result });
};
export const tester = (req, res) => {

 
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @returns User
 */
const middleware = (req, res) => {
  let user;
  let token = req.headers.authorization;
  if (token) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }
    // verifies secret and checks if the token is expired
    jwt.verify(token.replace(/^Bearer\s/, ""), config.authSecret, function(
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({ message: "unauthorized" });
      } else {
        user = decoded;
      }
    });
  } else {
    return res.status(401).json({ message: "unauthorized" });
  }
  return user;
};
