/*jshint -W014*/

import Good from "../models/Good";
import Shop from "../models/Shop";
const validator = require("express-validator");
const config = require("../config");
const jwt = require("jsonwebtoken");
import RATES from "../models/payRates";
const Ravepay = require("flutterwave-node");
const rave = new Ravepay(
  process.env.PUBLIC_KEY,
  process.env.PRIVATE_KEY,
  false
);

// Get all
export const list = async (req, res, next)=>{
  Good.find({_id: { $exists: true }})
    .populate("Shop", ["name"])
    .exec(function(err, goods) {
      return err
        ? res.status(500).json({ message: "Error getting records." })
        : res.json(goods);
    });
  // return res.json(await Good.find({ _id: { $exists: true } }).populate({
  //   path: "Shop",
  //   populate: { path: "owner" }
  // }).exec())
};

// Get one
export const show = function (req, res) {
  var id = req.params.id;
  Good.findOne({ _id: id })
    .populate("Shop", ["name"])
    .exec((err, good) => {
      if (err) {
        return res.status(500).json({
          message: "Error getting record."
        });
      }
      if (!good) {
        return res.status(404).json({
          message: "No such record"
        });
      }
      return res.json(good);
    });
};

// Create
export const create = [
  // validations rules
  validator.body("name", "Please enter Good name").isLength({ min: 1 }),
  validator
    .body("description", "Please enter Description")
    .isLength({ min: 1 }),
  validator
    .body("price", "Please enter Price for the product")
    .isLength({ min: 1 }),
  validator.body("category", "Please enter category").isLength({ min: 1 }),
  validator.body("shop_id", "Please enter shop id").isLength({ min: 1 }),

  async function(req, res) {
    // throw validation errors
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }
    var token = req.headers.authorization;
    let user;
    if (token) {
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
    //make sure the shop exists
    let shop = await Shop.findById(req.body.shop_id).exec();
    if (!shop) {
      return res.status(422).json({ error: "Shop doesnt exist" });
    }
    // initialize record
    let good = new Good({
      name: req.body.name,
      price: req.body.price,
      // for simplicity, let default shipping cost for all goods be $10
      shipping_cost: 10,
      description: req.body.description,
      category: req.body.category,
      image: `deal${Math.ceil(Math.random(1, 4) * 4)}.jpg`,
      Shop: shop._id
    });

    // save record
    good.save(function(err, good) {
      if (err) {
        return res.status(500).json({
          message: "Error saving record",
          error: err
        });
      }
      shop.goods = [...shop.goods, { Good: good._id }];
      shop.save();
      return res.json({
        message: "saved",
        _id: good._id,
        image: good.image
      });
    });
  }
];

// Update
export const update = [
  // validation rules
  function(req, res) {
    // throw validation errors
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    let id = req.params.id;
    Good.findOne({ _id: id }, function(err, good) {
      if (err) {
        return res.status(500).json({
          message: "Error saving record",
          error: err
        });
      }
      if (!good) {
        return res.status(404).json({
          message: "No such record"
        });
      }

      // initialize record
      good.name = req.body.name ? req.body.name : good.name;
      good.description = req.body.description
        ? req.body.description
        : good.description;
      good.price = req.body.price ? req.body.price : good.price;
      good.category = req.body.category ? req.body.category : good.category;

      // save record
      good.save(function(err, good) {
        if (err) {
          return res.status(500).json({
            message: "Error getting record."
          });
        }
        if (!good) {
          return res.status(404).json({
            message: "No such record"
          });
        }
        return res.json(good);
      });
    });
  }
];

// Delete
export const remove = (req, res) => {
  let id = req.params.id;
  Good.findByIdAndRemove(id, function(err, good) {
    if (err) {
      return res.status(500).json({
        message: "Error getting record."
      });
    }
    return res.json({ success: "deleted" });
  });
};

export const buy = async (req, res) => {
  if (!req.body.hasOwnProperty("receipt")) {
    return res.status(422).json({ error: "Receipt is required" });
  }
  // check if this transaction has been settled before from our database
  let exists = await Transaction.findOne({
    ref: req.body.receipt.tx_ref
  }).exec();
  if (exists !== null) {
    //this means that the transaction has been resolved already
    return res.status(403).json({ error: "Transaction already resolved" });
  }
  try {
    const response = await rave.VerifyTransaction.verify({
      txref: req.body.receipt.tx_ref
    });
    // get the goods from flutterwave response
    const prod_ids = response.data.meta.goods.split(",");
    let charged_goods = [];
    prod_ids.forEach(async elem => {
      charged_goods.push(
        await(
          Good.findOne({ _id: elem }).populate({
            path: "Shop",
            populate: { path: "owner" }
          })
        ).exec()
      );
    });
    let total_amount = charged_goods
      .map(good => good.price)
      .reduce((x, y) => x + y);
    // the currency must be equal, the amount must be equal and the status must be successsful
    if (
      response.status === "success" &&
      response.data.amount == total_amount &&
      response.data.currency === RATES.shop_opening_fee.currency &&
      response.data.status == "successful"
    ) {
      // now lets transfer the moneys to the sellers, and dispatch riders
      let transaction;
      charged_goods.forEach(product => {
        
      });
      transaction = new Transaction({
        name: "shop_opening_fee",
        ref: req.body.data.tx_ref,
        used: true,
        remark: "Completed",
        amount: RATES.shop_opening_fee.amount,
        meta: req.body.data
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
      // let user = new User({
      //   name: {
      //     surname: req.body.surname,
      //     firstname: req.body.firstname
      //   },
      //   email: req.body.email,
      //   phone_number: req.body.phone_number,
      //   password: req.body.password,
      //   roles: [{ role: "shop_owner" }, { role: "buyer" }],
      //   country: req.body.country,
      //   account: {
      //     account_number: req.body.account_number,
      //     bank: req.body.bank
      //   }
      // });
      // var salt = bcrypt.genSaltSync(10);
      // var hash = bcrypt.hashSync(user.password, salt);
      // user.password = hash;
      // user.save((err, user) => {
      //   transaction.User = user._id;
      //   transaction.save();
      //   shop.owner = user._id;
      //   shop.save();
      //   user.shop = shop._id;
      //   user.save();
      // });
      // let response = {};
      // response.message = "Transaction completed successfully";
      // response.shop_id = shop._id;
      // return res.json(response);
      return res.status(403).json({ error: "Invalid transaction" });
    }
  } catch (err) {}
};
