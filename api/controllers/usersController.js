import Shop from "../models/Shop";
const config = require("../config");
import User from "../models/User";
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var multer = require("multer");
let avatar;
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "static/img/thumbs/");
  },
  filename: function(req, file, cb) {
    let user;
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
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() });
          }
          user = decoded;
        }
      });
    } else {
      return res.status(401).json({ message: "unauthorized" });
    }
    var ext = file.originalname.split(".").pop();
    avatar = `${user._id}.${ext}`;
    cb(null, avatar);
  }
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted

    // To reject this file pass `false`, like so:
    // cb(null, false)

    // To accept the file pass `true`, like so:
    let acceptable_formats = ["png", "jpg", "jpeg", "svg"];
    if (acceptable_formats.includes(file.originalname.split(".").pop())) {
      cb(null, true);
    }
    // You can always pass an error if something goes wrong:
    // cb(new Error('I don\'t have a clue!'))
  }
}).single("avatar");

// Register
export const register = [
  // validations rules
  body("surname", "Please enter your  Surname").isLength({ min: 1 }),
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

//Edit
export const edit = [
  body("firstname", "Please enter firstname").isLength({ min: 2 }),
  body("surname", "Please enter surname").isLength({ min: 2 }),
  async function() {
    let user = middleware(req, res);
    let rbody = req.body;
    // start updating the user
    upload(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        return res.status(422).json({ message: "bad file input" });
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(422).json({ message: "error uploading your file" });
      }
    });
    /* jshint ignore:start */
    let UpdatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        name: {
          firstname: rbody.firstname,
          surname: rbody.surname
        },
        image: avatar.length ? avatar : user.image
      },
      {
        new: true
      }
    );
    return res.json({ user: UpdatedUser });
    /* jshint ignore:end */
  }
];

export const createShop = [
  //Do some validation
  body("name", "Please enter your Shop's name ").isLength({ min: 1 }),
  body("name").custom(value => {
    return Shop.findOne({ name: value }).then(shop => {
      if (shop !== null) {
        throw new Error('Shop name already in use');
      }
    });
  }),
  (req, res) => {
    let error = validationResult(req);
    if (!error) {
      let user = middleware(req, res);
    // initialize record of new shop,activate later when bill has been paid
    let shop = new Shop({
      name: req.body.name,
      description: req.body.desc, //
      owner: user._id,
      active: false
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
    } else {
      res.status(422).json(error);
    }
  }
];
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
        User.findOne(
          { email: decoded.email },
          ["name", "email", "image"],
          function(err, user) {
            if (err) {
              return res.status(500).json({
                message: "Error logging in",
                error: err
              });
            }
            return res.json({ user });
          }
        );
      }
    });
  } else {
    return res.status(401).json({ message: "unauthorized" });
  }
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
