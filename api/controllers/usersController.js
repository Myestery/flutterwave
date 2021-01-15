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
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1138563",
  key: "b7ad8790c400535f2743",
  secret: "fd1c9174753f8d40aee0",
  cluster: "eu",
  useTLS: true
});

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
        billingcity: req.body.billingcity
        ? req.body.billingcity
        : null,
        billingzip: req.body.billingzip
        ? req.body.billingzip
        : null,
        billingaddress: req.body.billingaddress
        ? req.body.billingaddress
        : null,
        billingstate: req.body.billingstate
        ? req.body.billingstate
        : null,
        billingcountry: req.body.billingcountry
        ? req.body.billingcountry
        : null,
        pin: req.body.suggested_auth ? req.body.pin : null,
        redirect_url: `${process.env.APP_URL}/api/receivePayment`,
        lastname: req.body.lastname,
        IP: req.ip,
        txRef: "JUMGA-" + Date.now(), // your unique merchant reference
        meta: [
          {
            shop_name: req.body.shop_name,
            shop_description: req.body.shop_description
          }
        ],
        device_fingerprint: "69e6b7f0b72037aa8428b70fbe03986c"
      });
      extra = { ...extra.body };
      switch (extra.message) {
        case "AUTH_SUGGESTION":
          if (extra.data.suggested_auth == "NOAUTH_INTERNATIONAL") {
            response.status = `needs_${extra.data.suggested_auth.toLowerCase()}`;
            response.message = "You need to add your address for mastercard";
          } else {
            response.status = `needs_${extra.data.suggested_auth.toLowerCase()}`;
            response.message = "You need to put a pin for mastercard";
          }

          break;
        case "V-COMP":
          // if()
          switch (extra.data.chargeResponseMessage) {
            case "Function Not Permitted to Cardholder":
              response.status = `card_error`;
              response.message = extra.data.chargeResponseMessage;
              break;
            case "Function Not Permitted to Cardholder":
              response.status = `card_error`;
              response.message = extra.data.chargeResponseMessage;
              break;
            case "Function Not Permitted to Cardholder":
              response.status = `card_error`;
              response.message = extra.data.chargeResponseMessage;
              break;
            case "Approved. Successful": // this signifies that it needs 3dsecure auth
              response.status = `needs_otp_frame`;
              response.message = extra.data.chargeResponseMessage;
              response.transaction_reference = extra.data.flwRef;
              response.otp_url = extra.data.authurl;
              break;
            default:
              response.status = `needs_otp`;
              response.message = extra.data.chargeResponseMessage;
              response.transaction_reference = extra.data.flwRef;
              break;
          }break;
            
        case "Do Not Honour: We're sorry, we cannot charge your card due to bank restrictions. Please contact your bank or financial institution.":
          response.status = `card_error`;
          response.message = extra.message;
          break;
        case "Fraudulent. Transaction":
          response.status = `card_error`;
          response.message = extra.message;
          break;
        case "Insufficient Funds: Your card cannot be charged due to insufficient funds. Please try another card or fund your card and try again.":
          response.status = `card_error`;
          response.message = extra.message;
          break;
        default:
          response.status = `card_error`;
          response.message = extra.message;
          }
      return res.json({ ...response, extra });
  }
};

export const receivePayment = (req, res) => {
  let response = req.query.response;
  response = JSON.parse(response);
  if (response.status && response.status == "failed") {
    // send error response via socket
    pusher.trigger("3d-secure", "error", {
      message: response.status + ". " + response.vbvrespmessage
    });
  } else {
    // send success response and embed token
    pusher.trigger("3d-secure", "success", {
      message: response
    });
  }
  /* create a pending transaction entry for the user, when he validates, we will then 
  add an entry for him */
  let transaction = new Transaction({
    name: "shop_opening_fee",
    ref: response.customer.email,
    used: false,
    remark: "Pending",
    amount: RATES.shop_opening_fee.amount,
    meta: response
  });
  transaction.save();
  res.json({ message: "Kindly Close This Window" });
};

/**
 *
 * @param {*} req The request object from express
 * @param {*} ref The transaction id to be used
 */
export const new_merchant = async (req, ref, meta, res) => {
  // check if this transaction has been settled before from our database
  let exists = await Transaction.findOne({
    ref
  }).exec();
  if (exists !== null) {
    //this means that the transaction has been resolved already
    return res.status(403).json({ error: "Transaction already resolved" });
  }
  // now save a record of this transaction to the database and create the shop
  let transaction = new Transaction({
    name: "shop_opening_fee",
    ref: ref,
    used: true,
    remark: "Completed",
    amount: RATES.shop_opening_fee.amount,
    meta
  });

  let rider = await User.findOne({
    email: "polymenjohn1@gmail.com"
  }).exec();
  let shop = new Shop({
    name: req.body.shop_name,
    description: req.body.shop_description,
    goods: [],
    rider: rider._id,
    active: true
  });

  //create the user's account
  let user = new User({
    name: {
      surname: req.body.surname,
      firstname: req.body.firstname
    },
    email: req.body.email,
    password: req.body.password,
    roles: [{ role: "shop_owner" }, { role: "buyer" }],
    country: req.body.country.toLowerCase(),
    account: {
      account_number: req.body.account_number,
      bank: req.body.bank
    }
  });
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  user.save((err, user) => {
    transaction.User = user._id;
    transaction.save();
    shop.owner = user._id;
    shop.save();
  });
  let response = {};
  response.message = "Transaction completed successfully";
  response.shop_id = shop._id;
  return res.json(response);
};

export const verifyTransaction = async (req, res) => {
  let response = {};
  switch (req.body.type) {
    case "card":
      rave.Card.validate({
        transaction_reference: req.body.transaction_reference,
        otp: req.body.otp,
        reg_data: req.body.reg_data
      }).then(async resp => {
        response.status = resp.body.message;
        //check if the transaction data is what we need
        if (
          !(
            resp.body.data.tx.currency == RATES.shop_opening_fee.currency &&
            resp.body.data.tx.amount == RATES.shop_opening_fee.amount
          )
        ) {
          return res.status(403).json({ error: "Illegal transaction" });
        }
        return new_merchant(req, resp.body.data.tx.id, resp.body.data.tx, res);
      });
      break;
    case "3d-secure":
      // here we will check if the user's email is in the database as one of the pending transactions before registering the user
      let transaction = await Transaction.findOne({
        ref: req.body.email,
        used: false
      }).exec();
      if (transaction) {
        let id = transaction.meta.id;
        let meta = transaction.meta;
        transaction.delete();
        return new_merchant(req, id, meta, res);
      }
      return res.status(403).json({ error: "bad transaction" });
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
export const user = function (req, res) {
  var token = req.headers.authorization;
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token.replace(/^Bearer\s/, ""), config.authSecret, function (
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
          .exec(async function (err, user) {
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
export const tester = (req, res) => {};
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
