/*jshint -W014*/

import Good from "../models/Good";
import Shop from "../models/Shop";
const validator = require("express-validator");
const config = require("../config");
const jwt = require("jsonwebtoken");

// Get all
export const list = function(req, res, next) {
  Good.find()
    .populate("User", ["name", "email", "image"])
    .exec(function(err, goods) {
      return err
        ? res.status(500).json({ message: "Error getting records." })
        : res.json(goods);
    });
};

// Get one
export const show = function(req, res) {
  var id = req.params.id;
  Good.findOne({ _id: id })
    .populate("User", ["name", "email", "image"])
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
  validator.body("description", "Please enter Description").isLength({ min: 1 }),
  validator.body("price", "Please enter Price for the product").isLength({ min: 1 }),
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
    let shop = await Shop.findById(req.body.shop_id).exec()
    if (!shop) {
      return res.status(422).json({"error":"Shop doesnt exist"})
    }
    // initialize record
    let good = new Good({
      name: req.body.name,
      price: req.body.price,
      // Shop: user.Shop
      description: req.body.description,
      category: req.body.category,
      image: `deal${Math.ceil(Math.random(1,4)*4)}.jpg`,
      Shop:shop._id
    });

    // save record
    good.save(function(err, good) {
      if (err) {
        return res.status(500).json({
          message: "Error saving record",
          error: err
        });
      }
      shop.goods = [...shop.goods, { Good: good._id }]
      shop.save()
      return res.json({
        message: "saved",
        _id: good._id,
        image:good.image
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
      good.name = req.body.name ? req.body.name : good.name
      good.description = req.body.description ? req.body.description : good.description
      good.price = req.body.price ? req.body.price : good.price
      good.category = req.body.category?req.body.category:good.category

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
    return res.json({success:"deleted"});
  });
};
