
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);

module.exports = (req, res) => {
  if (req.method === "GET") return userController.getAllUsers(req, res);
  if (req.method === "POST") return userController.createUser(req, res);
  res.status(405).json({ message: "Method not allowed" });
};
