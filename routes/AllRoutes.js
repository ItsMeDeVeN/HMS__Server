const express = require("express");
const {
  registerdoctor,
  registerpatient,
  login,
  forgotpassword,
} = require("../Controller/usercontroller");
const {
  bookappointment,
  getallappointments,
  updateappointmentstatus,
  deleteappointment,
  allappointmentsdetails,
} = require("../Controller/appointmentcontroller");
const router = express.Router();

router.post("/registerdoctor", registerdoctor);
router.post("/registerpatient", registerpatient);
router.post("/login", login);
router.post("/forgotpassword", forgotpassword);
router.post("/bookappointment", bookappointment);
router.post("/getallappointments", getallappointments);
router.post("/updateappointmentstatus", updateappointmentstatus);
router.post("/deleteappointment", deleteappointment);
router.post("/allappointmentsdetails", allappointmentsdetails);

module.exports = router;
