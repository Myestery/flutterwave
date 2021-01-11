const config = require("../config");
const { Router } = require("express");

const router = Router();

// Initialize Controller
import {
  list,
  show,
  create,
  update,
  remove,
  addComment,
  toggleLike
} from "../controllers/goodsController";

// Get All
router.get("/blogs", list);

// Get One
router.get("/blogs/:id", show);

// Create
router.post("/blogs", config.isAuthenticated, create);

// Update
router.put("/blogs/:id", config.isAuthenticated, update);

// Delete
router.delete("/blogs/:id", config.isAuthenticated, remove);

// New Comment
router.post("/blogs/:id/comment", config.isAuthenticated, addComment);

// New Like
router.post("/blogs/:id/like", config.isAuthenticated, toggleLike);

export default router;
