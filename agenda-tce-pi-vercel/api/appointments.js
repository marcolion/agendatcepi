
const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.get("/", appointmentController.getAllAppointments);
router.post("/", appointmentController.createAppointment);

module.exports = (req, res) => {
  if (req.method === "GET") return appointmentController.getAllAppointments(req, res);
  if (req.method === "POST") return appointmentController.createAppointment(req, res);
  res.status(405).json({ message: "Method not allowed" });
};
