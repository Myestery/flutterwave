const express = require("express");
const db = require("./db");

// Create express instnace
const app = express();

// Init body-parser options (inbuilt with express)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Require & Import API routes
import users from "./routes/users"
import goods from "./routes/goods";
import shops from "./routes/shops";

// Use API Routes
app.use(users);
app.use(goods);
app.use(shops);

// Export the server middleware
module.exports = {
  path: "/api",
  handler: app
};