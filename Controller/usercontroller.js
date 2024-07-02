const PatientModel = require("../model/PatientSchema");
const DoctorModel = require("../model/DoctorSchema");
const Appointment_Details = require("../model/AppointmentSchema");
const { generateToken } = require("../middleware/middleware");
// const { verified } = require("../admin/Controller/admincontroller");
// const multer = require("multer");
// const fs = require("fs");

const registerpatient = async (req, res) => {
  try {
    const { name, email, password, confirmpassword, contact, ...rest } =
      req.body;
    if (!name) {
      return res
        .status(400)
        .send({ message: "Name is a compulsion!!", status: 400 });
    }
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
    if (!confirmpassword) {
      return res
        .status(400)
        .send({ message: "ConfirmPassword is a compulsion!!", status: 400 });
    }
    if (!contact) {
      return res
        .status(400)
        .send({ message: "Contact is a compulsion!!", status: 400 });
    }

    const existinguser = await PatientModel.findOne({ email });
    if (existinguser) {
      return res.status(409).send({
        success: false,
        message: "Email already exists.",
      });
    }
    const patient = new PatientModel({
      ...req.body,
      role: "Patient",
      activation_status: true,
    });
    await patient.save();

    res.status(201).send({
      success: true,
      message: "Patient registered Succesfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while registaring Patient details",
      errormsg: error,
    });
    console.log(error);
  }
};

const registerdoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmpassword,
      contact,
      department,
      ...rest
    } = req.body;
    if (!name) {
      return res
        .status(400)
        .send({ message: "Name is a compulsion!!", status: 400 });
    }
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
    if (!confirmpassword) {
      return res
        .status(400)
        .send({ message: "ConfirmPassword is a compulsion!!", status: 400 });
    }
    if (!contact) {
      return res
        .status(400)
        .send({ message: "Contact is a compulsion!!", status: 400 });
    }
    if (!department) {
      return res
        .status(400)
        .send({ message: "Department is a compulsion!!", status: 400 });
    }

    const existinguser = await DoctorModel.findOne({ email });
    if (existinguser) {
      return res.status(409).send({
        success: false,
        message: "Email already exists.",
      });
    }
    const doctor = new DoctorModel({
      ...req.body,
      role: "Doctor",
      verified: false,
      activation_status: true,
    });
    await doctor.save();

    res.status(201).send({
      success: true,
      message: "Doctor registered Succesfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while registaring Doctor details",
      errormsg: error,
    });
    console.log(error);
  }
};

const login = async (req, res) => {
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

    const existinguser = await DoctorModel.findOne({ email });
    if (existinguser) {
      try {
        if (existinguser.password !== password) {
          return res.status(403).send({
            success: false,
            message: "Wrong password Entered😵😵",
            role: existinguser.role,
          });
        }
        const token = generateToken(existinguser._id, existinguser.name);
        res.status(200).send({
          success: true,
          message: "Doctor Logged in succesfully 🥳🥳",
          user: existinguser,
          token: token,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "Error occured while logging",
          errormsg: error,
          role: role,
        });
        console.log(error);
      }
    } else if (!existinguser) {
      const existinguser = await PatientModel.findOne({ email });
      if (existinguser) {
        try {
          if (existinguser.password !== password) {
            return res.status(403).send({
              success: false,
              message: "Wrong password Entered😵😵",
              role: existinguser.role,
            });
          }
          const token = generateToken(existinguser._id, existinguser.name);
          res.status(200).send({
            success: true,
            message: "Patient Logged in succesfully 🥳🥳",
            user: existinguser,
            token: token,
          });
        } catch (error) {
          res.status(500).send({
            success: false,
            message: "Error occured while logging",
            errormsg: error,
            role: existinguser.role,
          });
          console.log(error);
        }
      } else {
        return res.status(404).send({
          success: false,
          message: "User not found.",
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: error,
    });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email, newpassword, confirmnewpassword } = req.body;

    if (!email || !newpassword || !confirmnewpassword) {
      return res.status(400).send({
        message: "All fields are compulsory!",
        status: 400,
      });
    }

    if (newpassword !== confirmnewpassword) {
      return res.status(403).send({
        success: false,
        message: "Both passwords should match!!!",
      });
    }

    const existingUser =
      (await DoctorModel.findOne({ email })) ||
      (await PatientModel.findOne({ email }));

    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    existingUser.password = newpassword;
    existingUser.confirmpassword = confirmnewpassword;
    await existingUser.save();
    return res.status(200).send({
      success: true,
      message: "Password updated successfully 🥳🥳!!!",
      user: existingUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error occurred while updating password!!!",
      errormsg: error.message,
    });
    console.error(error);
  }
};

const bookappointment = async (req, res) => {
  try {
    const { docid, docname, patientid, slotid, ...rest } = req.body;

    if (!docid || !patientid || !slotid) {
      return res.status(400).send({
        success: false,
        message: "All the ids are compulsory to proceed !!!",
      });
    }

    const existingAppointment = await Appointment_Details.findOne({
      docid: docid,
      patientid: patientid,
      slotid: slotid,
    });

    if (existingAppointment) {
      return res.status(409).send({
        success: false,
        message: "Appointment already exists !!!",
      });
    }

    const appointment = new Appointment_Details({ ...req.body });
    await appointment.save();

    res.status(200).send({
      success: true,
      message: "Appointment Booked Successfully !!!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occurred while registering an appointment",
      errormsg: error.message, // Use error.message to get the specific error message
    });
    console.error("An error occurred while registering an appointment:", error);
  }
};

const getallpatientappointments = async (req,res) => {
  try{
    const{patientid, ...rest} = req.body;
    if(!patientid){
      return res.status(400).send({
        success: false,
        message: "PateintId is required for fetching all the details"
      })
    }

    const allappointments = await Appointment_Details.find({patientid});
    res.status(200).send({
      success: true,
      message: "All appointments fetched successfully !!!",
      appointments : allappointments,
    });
  }catch(error){
    return res.status(500).send({
      success: false,
      message: "Error occured while fetching all appointments",
      errormsg: error,
    })
  }
};


module.exports = { registerpatient, registerdoctor, login, forgotpassword, bookappointment, getallpatientappointments };
