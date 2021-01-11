/*jshint -W014*/

import Good from "../models/Good";
const validator = require("express-validator");
const config = require("../config");
const jwt = require("jsonwebtoken");

// Get all
export const list = function(req, res, next) {
  Good.find()
    .populate("User", ["name", "email", "image"])
    .exec(function(err, blogs) {
      return err
        ? res.status(500).json({ message: "Error getting records." })
        : res.json(blogs);
    });
};

// Get one
export const show = function(req, res) {
  var id = req.params.id;
  Good.findOne({ _id: id })
    .populate("User", ["name", "email", "image"])
    .populate({
      path: "comments",
      populate: {
        path: "User",
        model: "User",
        select: ["name", "email", "image"]
      }
    })
    .exec((err, blog) => {
      if (err) {
        return res.status(500).json({
          message: "Error getting record."
        });
      }
      if (!blog) {
        return res.status(404).json({
          message: "No such record"
        });
      }
      return res.json(blog);
    });
};

// Create
export const create = [
  // validations rules
  validator.body("title", "Please enter Good Title").isLength({ min: 1 }),
  validator.body("body", "Please enter Article Content").isLength({ min: 1 }),

  function(req, res) {
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
    // initialize record
    let blog = new Good({
      title: req.body.title,
      body: req.body.body,
      User: user._id
    });

    // save record
    blog.save(function(err, blog) {
      if (err) {
        return res.status(500).json({
          message: "Error saving record",
          error: err
        });
      }
      return res.json({
        message: "saved",
        _id: blog._id
      });
    });
  }
];

// Update
export const update = [
  // validation rules
  validator.body("title", "Please enter Good Title").isLength({ min: 1 }),

  validator.body("body", "Please enter Good Content").isLength({ min: 1 }),

  function(req, res) {
    // throw validation errors
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    let id = req.params.id;
    Good.findOne({ _id: id }, function(err, blog) {
      if (err) {
        return res.status(500).json({
          message: "Error saving record",
          error: err
        });
      }
      if (!blog) {
        return res.status(404).json({
          message: "No such record"
        });
      }

      // initialize record
      blog.title = req.body.title ? req.body.title : blog.title;
      // blog.author =  req.body.author ? req.body.author : blog.author;
      blog.body = req.body.body ? req.body.body : blog.body;

      // save record
      blog.save(function(err, blog) {
        if (err) {
          return res.status(500).json({
            message: "Error getting record."
          });
        }
        if (!blog) {
          return res.status(404).json({
            message: "No such record"
          });
        }
        return res.json(blog);
      });
    });
  }
];

// Delete
export const remove = (req, res) => {
  let id = req.params.id;
  Good.findByIdAndRemove(id, function(err, blog) {
    if (err) {
      return res.status(500).json({
        message: "Error getting record."
      });
    }
    return res.json(blog);
  });
};

// Add Comment
export const addComment = [
  // validation rules
  validator
    .body("comment", "Please enter a valid comment")
    .isLength({ min: 1 }),
  (req, res) => {
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
    let id = req.params.id;
    Good.findOne({ _id: id }, function(err, blog) {
      if (err) {
        return res.status(500).json({
          message: "Error saving record",
          error: err
        });
      }
      if (!blog) {
        return res.status(404).json({
          message: "No such record"
        });
      }
      // Add the comment
      blog.comments.push({ comment: req.body.comment, User: user._id });

      // save record
      blog.save(function(err, blog) {
        if (err) {
          return res.status(500).json({
            message: "Error getting record."
          });
        }
        if (!blog) {
          return res.status(404).json({
            message: "No such record"
          });
        }
        return show(req, res);
      });
    });
  }
];

// Add Like
export const toggleLike = (req, res) => {
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
  let id = req.params.id;
  Good.findOne({ _id: id }, function(err, blog) {
    if (err) {
      return res.status(500).json({
        message: "Error saving record",
        error: err
      });
    }
    if (!blog) {
      return res.status(404).json({
        message: "No such record"
      });
    }
    // Perform the like or unlike function
    let otherLikes = blog.likes.filter(x => x.User != user._id);
    blog.likes =
      otherLikes.length == blog.likes.length
        ? [...otherLikes, { User: user._id }]
        : otherLikes;
    
    // save record
    blog.save(function(err, blog) {
      if (err) {
        return res.status(500).json({
          message: err
        });
      }
      if (!blog) {
        return res.status(404).json({
          message: "No such record"
        });
      }
      return show(req, res);
    });
  });
};
