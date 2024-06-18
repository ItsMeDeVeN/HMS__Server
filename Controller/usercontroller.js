const PatientModel = require("../model/PatientSchema");
const DoctorModel = require("../model/DoctorSchema");
const { generateToken } = require("../middleware/middleware");

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
    const patient = new PatientModel({ ...req.body });
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
    const { name, email, password, confirmpassword, contact, department, ...rest } =
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
    const doctor = new DoctorModel({ ...req.body });
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


const login = async(req, res) => {
  try{
    const{ email, password, ...rest} = req.body;

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
    if(existinguser){
      try{
      role = "Doctor";
      if(existinguser.password !== password){
        return res.status(403).send({
          success: false,
          message: "Wrong password Entered😵😵",
          role: role,
        });
      }
      const token = generateToken(existinguser._id, existinguser.name)
      res.status(200).send({
        success: true,
        message: "Doctor Logged in succesfully 🥳🥳",
        user: existinguser,
        role: role,
        token: token,
      });
    
    }catch (error) {
      res.status(500).send({
        success: false,
        message: "Error occured while logging",
        errormsg: error,
        role: role,
      });
      console.log(error);
    }
  }
    else if(!existinguser){
      const existinguser = await PatientModel.findOne({ email });
      if(existinguser){
        try{
        role = "Patient";
        if(existinguser.password !== password){
          return res.status(403).send({
            success: false,
            message: "Wrong password Entered😵😵",
            role: role
          });
        }
        const token = generateToken(existinguser._id, existinguser.name)
        res.status(200).send({
          success: true,
          message: "Patient Logged in succesfully 🥳🥳",
          user: existinguser,
          role: role,
          token : token,
        });
      
      }catch (error) {
        res.status(500).send({
          success: false,
          message: "Error occured while logging",
          errormsg: error,
          role: role,
        });
        console.log(error);
      }
    }
      else{
        return res.status(404).send({
          success: false,
          message: "User not found.",
        });
      }
    }
  }
  catch{

  }
}
 
module.exports = { registerpatient, registerdoctor, login };