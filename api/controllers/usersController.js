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
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_PUBLIC_KEY,
  secret: process.env.PUSHER_PRIVATE_KEY,
  cluster: process.env.PUSHER_APP_CLUSTER,
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

/**
 *
 * @param {*} req The request object from express
 * @param {*} ref The transaction id to be used
 */
export const new_merchant = [
  body("surname", "Please enter your  Surname").isLength({ min: 1 }),
  body("country", "Please enter your  Country").isLength({ min: 1 }),
  body("firstname", "Please enter Firstname").isLength({ min: 1 }),
  body("email", "Please enter Email").isLength({ min: 1 }),
  body("pasword", "Please enter Password").isLength({ min: 1 }),
  body("bank", "Please enter Bank").isLength({ min: 1 }),
  body("phone_number", "Please enter a valid Phone number").isLength({
    min: 7
  }),
  body("account_number", "Please enter a valid Account number").isLength({
    min: 7
  }),
  body("shop_name", "Please enter shop name").isLength({ min: 7 }),
  async (req, res) => {
    // check if this transaction has been settled before from our database
    let exists = await Transaction.findOne({
      ref: req.body.data.tx_ref
    }).exec();
    if (exists !== null) {
      //this means that the transaction has been resolved already
      return res.status(403).json({ error: "Transaction already resolved" });
    }
    // next step is to verify that this transaction was successful with flutterwave api
    try {
      let subaccount_id;
      const response = await rave.VerifyTransaction.verify({
        txref: req.body.data.tx_ref
      });
      // the currency must be equal, the amount must be equal and the status must be successsful
      if (
        response.status === "success" &&
        response.data.amount == RATES.shop_opening_fee.amount &&
        response.data.currency === RATES.shop_opening_fee.currency &&
        response.data.status == "successful"
      ) {
        // now save a record of this transaction to the database and create the shop
        let transaction = new Transaction({
          name: "shop_opening_fee",
          ref: req.body.data.tx_ref,
          used: true,
          remark: "Completed",
          amount: RATES.shop_opening_fee.amount,
          meta: req.body.data
        });
        // these are the seeded dispatch riders, so we assign a random one
        let rider = await User.findOne({
          email: [
            "Ade@gmail.com",
            "Olu@gmail.com",
            "musa@gmail.com",
            "gbenga@gmail.com"
          ][Math.round(Math.random(1, 4) * 4)]
        }).exec();
        let shop = new Shop({
          name: req.body.shop_name,
          description: req.body.shop_description,
          goods: [],
          rider: rider._id,
          active: true
        });

        // now we will create a subaccount for the user that we'll use to pay him
        const payload = {
          account_bank: req.body.bank,
          account_number: req.body.account_number,
          business_name: req.body.shop_name,
          business_email: req.body.email,
          business_contact: `${req.body.surname} ${req.body.firstname}`,
          business_contact_mobile: req.body.phone_number,
          business_mobile: req.body.phone_number,
          country: req.body.country,
          split_type: "percentage",
          split_value: RATES.Sales.JumgaCommision
        };

        axios
          .post("https://api.flutterwave.com/v3/subaccounts", payload, {
            headers: {
              Authorization: `Bearer ${process.env.PRIVATE_KEY}`,
              "Content-Type": "application/json; charset=UTF-8",
              Accept: "*/*"
            }
          })
          .then(respons => {
            console.log(respons.data.data);
            subaccount_id = respons.data.data.subaccount_id;
            shop.subaccount_id = respons.data.data.subaccount_id;
            //create the user's account
            let user = new User({
              name: {
                surname: req.body.surname,
                firstname: req.body.firstname
              },
              email: req.body.email,
              phone_number: req.body.phone_number,
              password: req.body.password,
              roles: [{ role: "shop_owner" }, { role: "buyer" }],
              country: req.body.country,
              account: {
                account_number: req.body.account_number,
                bank: req.body.bank,
                subaccount_id
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
              user.shop = shop._id;
              user.save();
            });
            let response = {};
            response.message = "Transaction completed successfully";
            response.shop_id = shop._id;
            return res.json(response);
          })
          .catch(err => {
            // return res.status(401).json({ error: "Something went wrong" });
          });
      } else return res.status(403).json({ error: "Invalid transaction" });
    } catch (error) {
      return res.status(500).json({ error: "Unexpected error occured" });
    }
  }
];

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
          "shop",
          "phone_number"
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
  let abbr = req.query.country;
  // let country = req.query.country.toLowerCase();
  // let abbr = [
  //   { nigeria: "NG" },
  //   { uk: "UK" },
  //   { kenya: "KE" },
  //   { ghana: "GH" }
  // ].filter(x => Object.keys(x)[0] == country)[0][country];
  let banks;
  axios.defaults.headers.authorization = `Bearer ${process.env.PRIVATE_KEY}`;
  banks = await axios.get(`https://api.flutterwave.com/v3/banks/${abbr}`);
  return res.json({ banks: banks.data.data });
};

export const verifyBank = async (req, res) => {
  let result = { status: true };
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

export const checkMail = async (req, res) => {
  let exists = await User.findOne({ email: req.body.email }).exec();
  let account_exist = await User.findOne({
    "account.account_number": req.body.account_number
  }).exec();
  // verify if email is in use already
  if (exists !== null) {
    console.log("email in use");
    return res.status(422).json({ error: "sorry, email already exists" });
  }
  // check if account number is in use already
  if (account_exist !== null) {
    console.log("email in use");
    return res
      .status(422)
      .json({ error: "sorry, account number already exists" });
  }
  // Verify bank account is valid with flutterwave api
  let acc_ver_result = { status: true };
  axios
    .post(
      "https://api.flutterwave.com/v3/accounts/resolve",
      {
        account_number: req.body.account_number,
        account_bank: req.body.account_bank
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PRIVATE_KEY}`,
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "*/*"
        }
      }
    )
    .then(respons => {
      console.log(respons.data);
      acc_ver_result = respons.data;
      return res.json({ acc_ver_result, status: true });
    })
    .catch(err => {
      console.log(err.response.data);
      acc_ver_result = err.response.data;
      return res
        .status(401)
        .json({ ...acc_ver_result, error: acc_ver_result.message });
    });
};

export const seedDatabase = async (req, res) => {
  let riders = [
    {
      firstname: "Ade",
      surname: "ola",
      country: "NG",
      email: "Ade@gmail.com",
      account_number: "0690000031",
      bank: "044",
      subaccount_id: "RS_46A212FC6CCF28C6BF44A7FE040633B0"
    },
    {
      surname: "Olu",
      firstname: "Mide",
      email: "Olu@gmail.com",
      country: "NG",
      account_number: "0690000032",
      bank: "044",
      subaccount_id: "RS_B832B81A843554C410E418EAF54C2242"
    },
    {
      surname: "Musa",
      firstname: "Shekau",
      email: "musa@gmail.com",
      country: "NG",
      account_number: "0690000033",
      bank: "044",
      subaccount_id: "RS_6E9D1CD2FAD0F9FD93FAB635206EB7A0"
    },
    {
      firstname: "Fatai",
      surname: "gbenga",
      email: "gbenga@gmail.com",
      country: "NG",
      account_number: "0690000034",
      bank: "044",
      subaccount_id: "RS_32EABB82950364E85AD5D7029DB46427"
    }
  ];
  for (let x = 0; x < riders.length; x++) {
    var salt = bcrypt.genSaltSync(10);

    let user = new User({
      name: {
        surname: riders[x].surname,
        firstname: riders[x].firstname
      },
      email: riders[x].email,
      phone_number: "010239365",
      password: bcrypt.hashSync("password", salt),
      roles: [{ role: "rider" }, { role: "buyer" }],
      country: riders[x].country,
      account: {
        account_number: riders[x].account_number,
        bank: riders[x].bank,
        subaccount_id: riders[x].subaccount_id
      }
    });
    user.save();
  }
  return res.json({ message: "database seeded successfully" });
};
