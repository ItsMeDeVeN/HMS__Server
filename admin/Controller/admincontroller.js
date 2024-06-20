const PatientModel = require("../../model/PatientSchema");
const DoctorModel = require("../../model/DoctorSchema");
const AdminModel = require("../model/AdminSchema");

const registeradmin = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;
    if (!email) {
      return res
        .status(400)
        .send({ message: "Email is a compulsion!!", status: 400 });
    }

    if (!password) {
      return res
        .status(400)
        .send({ message: "Password is a compulsion!!", status: 400 });
    }

    const existingadmin = await AdminModel.findOne({ email });
    if (existingadmin) {
      return res.status(409).send({
        success: false,
        message: "Email already exists.",
      });
    }
    const admin = new AdminModel({ ...req.body, role: "Admin" });
    await admin.save();

    res.status(201).send({
      success: true,
      message: "Admin registered Succesfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while registaring Admin details",
      errormsg: error,
    });
    console.log(error);
  }
};

const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({
        message: "Email is a compulsion!!",
      });
    }
    if (!password) {
      return res.status(400).send({
        message: "Password is a compulsion!!",
      });
    }
    const existingadmin = await AdminModel.findOne({ email });
    if (!existingadmin) {
      return res.status(403).send({
        success: false,
        message: "Admin not found!!!!!!!",
      });
    }
    if (existingadmin.password !== password) {
      return res.status(403).send({
        success: false,
        message: "Wrong password Entered😵😵",
      });
    }

    res.status(200).send({
      success: true,
      message: "Admin Logged in succesfully 🥳🥳",
      admin: existingadmin,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error occured while logging",
      errormsg: error,
    });
    console.log(error);
  }
};

const getAllPatients = async (req, res) => {
  try {
    const allPatients = await PatientModel.find();
    res.status(200).send({
      success: true,
      message: "All Patients fetched successfully",
      patients: allPatients,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in fetching patients",
      error,
    });
    console.log(error);
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const allDoctors = await DoctorModel.find();
    res.status(200).send({
      success: true,
      message: "All doctors fetched successfully",
      doctors: allDoctors,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in fetching doctors",
      error,
    });
    console.log(error);
  }
};

module.exports = { getAllDoctors, getAllPatients, adminlogin, registeradmin };
