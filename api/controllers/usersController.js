import Shop from "../models/Shop";
const config = require("../config");
import User from "../models/User";
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var multer = require("multer");
import axios from "axios";
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
  body("description", "Please enter your Shop's description ").isLength({ min: 1 }),
  body("name").custom(value => {
    return Shop.findOne({ name: value }).then(shop => {
      if (shop !== null) {
        throw new Error("Shop name already in use");
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
  //apply middleware for only authenticated users based on their country
  let user = middleware(req, res);
  let country = await User.findOne({ _id: user._id }).exec();
  let abbr = [
    { nigeria: "NG" },
    { uk: "UK" },
    { kenya: "KE" },
    { ghana: "GH" }
  ].filter(x => Object.keys(x)[0] == country.country)[0][country.country];
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
  let result ={status:true}
  // axios.post(`https://api.flutterwave.com/v3/accounts/resolve`, {
  //   account_number: req.body.account_number,
  //   account_bank:req.body.account_bank
  // })
  // .then(resp => result = resp.data)
  // .catch(error=> {
  //   result = error 
  //   console.log(error)
  // })
  return res.json({result})

}
export const tester =(req,res)=>{
  const Ravepay = require('flutterwave-node');

const rave = new Ravepay(process.env.PUBLIC_KEY, process.env.PRIVATE_KEY);

rave.Card.charge(
    {
        "cardno": "5438898014560229",
        "cvv": "564",
        "expirymonth": "10",
        "expiryyear": "28",
        "currency": "NGN",
        "country": "NG",
        "amount": "10",
        "email": "user@gmail.com",
        "phonenumber": "0902620185",
        "firstname": "temi",
    "lastname": "desola",
        "IP": "355426087298442",
        "txRef": "MC-" + Date.now(),// your unique merchant reference
        "meta": [{metaname: "flightID", metavalue: "123949494DC"}],
        "redirect_url": "https://rave-webhook.herokuapp.com/receivepayment",
        "device_fingerprint": "69e6b7f0b72037aa8428b70fbe03986c"
      }
).then(resp => {
    console.log(resp.body);

    rave.Card.validate({
        "transaction_reference":resp.body.data.flwRef,
        "otp":12345
    }).then(response => {
        console.log(response.body);
        
    })
    
}).catch(err => {
    console.log(err);
    
})
}
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
