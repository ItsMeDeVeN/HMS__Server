const PatientModel = require("../../model/PatientSchema");
const DoctorModel = require("../../model/DoctorSchema");
const AdminModel = require("../model/AdminSchema");
const {generateToken} = require("../middleware/adminmiddleware")


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
    const token = generateToken(existingadmin._id, existingadmin.password);
    res.status(200).send({
      success: true,
      message: "Admin Logged in succesfully 🥳🥳",
      admin: existingadmin,
      token: token
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search ? {
      $or: [
        { name: { $regex: req.query.search, $options: 'i' } }, // Case-insensitive search on doctor's name
        ]
    } : {};

    const allPatients = await PatientModel.find(searchQuery)
    .skip(skip)
    .limit(limit);

    const total = await PatientModel.countDocuments();
    const totalPages = Math.ceil(total/ limit);

    res.status(200).send({
      success: true,
      message: "All Patients fetched successfully",
      patients: allPatients,
      page,
      totalPages,
      total
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search ? {
      $or: [
        { name: { $regex: req.query.search, $options: 'i' } }, // Case-insensitive search on doctor's name
        ]
    } : {};
    const allDoctors = await DoctorModel.find(searchQuery)
    .skip(skip)
    .limit(limit);

    const total = await DoctorModel.countDocuments(searchQuery);
    const totalPages = Math.ceil(total/ limit);

    res.status(200).send({
      success: true,
      message: "All doctors fetched successfully",
      doctors: allDoctors,
      page,
      totalPages,
      total
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

const verified = async (req, res) => {
  try {
    const { id } = req.body; // Extract id and role from request body

    if (!id) {
      return res.status(400).send({
        message: "Id is required!",
        status: 400,
      });
    }
    let existingDoc = await DoctorModel.findById(id); // Use findById to fetch the doctor
    if (!existingDoc) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found.",
      });
    } else {
      // Toggle the verified status
      existingDoc.verified = !existingDoc.verified;
      // Save the updated user
      await existingDoc.save();

      return res.status(200).send({
        success: true,
        message: `${
          existingDoc.verified ? "Verified" : "Unverified"
        } Successfully!`,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "An error occurred while updating the verification status.",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        message: "Id is required!",
        status: 400,
      });
    }

    const existingUser =
      (await DoctorModel.findById(id)) || (await PatientModel.findById(id));
    console.log(existingUser);
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const deleteData = await existingUser.deleteOne();
    if (deleteData) {
      return res.status(200).send({
        success: true,
        message: "User Deleted Succesfully.",
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "User Not Deleted!!!!!!",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting the details",
      errormsg: error,
    });
    console.log(error);
  }
};

const getdetails = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        message: "Id is required!",
        status: 400,
      });
    }
    const existingUser =
      (await DoctorModel.findById(id)) || (await PatientModel.findById(id));
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    } else if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "Details Fetched Succesfully.",
        details: existingUser,
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Details Not Fetched!!!!!!",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting the details",
      errormsg: error,
    });
    console.log(error);
  }
};

const updateDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      consultingfee,
      department,
      age,
      dateofbirth,
      gender,
      address,
      _id,
      availability,
      ...rest
    } = req.body;

    if (!name || !email || !contact || !_id) {
      return res.status(400).send({
        success: false,
        message: "All fields are required!!!!",
        details: res,
      });
    }

    let existingDoc;
    try {
      existingDoc = await DoctorModel.findById(_id);
      if (!existingDoc) {
        return res.status(404).send({
          success: false,
          message: "Doctor not found!!!",
        });
      }
    } catch (error) {
      console.error("Error finding doctor:", error);
      return res.status(500).send({
        success: false,
        message: "Error occurred while finding the doctor!!!",
      });
    }

    existingDoc.name = name;
    existingDoc.email = email;
    existingDoc.contact = contact;
    address ? (existingDoc.address = address) : existingDoc.address;
    gender ? (existingDoc.gender = gender) : existingDoc.gender;
    dateofbirth
      ? (existingDoc.dateofbirth = dateofbirth)
      : existingDoc.dateofbirth;
    age ? (existingDoc.age = age) : existingDoc.age;
    department ? (existingDoc.department = department) : existingDoc.department;
    consultingfee
      ? (existingDoc.consultingfee = consultingfee)
      : existingDoc.consultingfee;
    availability
      ? (existingDoc.availability = availability)
      : existingDoc.availability;

    try {
      // Save updated document
      await existingDoc.save();
    } catch (error) {
      console.error("Error saving doctor:", error);
      return res.status(500).send({
        success: false,
        message: "Error occurred while saving the doctor!!!",
      });
    }

    // Respond with success message and updated details
    return res.status(200).send({
      success: true,
      message: "Updated Successfully",
      updated_details: existingDoc,
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return res.status(500).send({
      success: false,
      message: "Error occurred while updating data!!!",
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      gender,
      dateofbirth,
      bloodgroup,
      age,
      address,
      medicalHistory,
      _id,
      ...rest
    } = req.body;

    if (!name || !email || !contact || !_id) {
      return res.status(400).send({
        success: false,
        message: "All fields are required!!!!",
        details: res,
      });
    }

    let existingPatient;
    try {
      existingPatient = await PatientModel.findById(_id);
      if (!existingPatient) {
        return res.status(404).send({
          success: false,
          message: "Patient not found!!!",
        });
      }
    } catch (error) {
      console.error("Error finding patient:", error);
      return res.status(500).send({
        success: false,
        message: "Error occurred while finding the patient!!!",
      });
    }

    existingPatient.name = name;
    existingPatient.email = email;
    existingPatient.contact = contact;
    gender ? (existingPatient.gender = gender) : existingPatient.gender;
    dateofbirth
      ? (existingPatient.dateofbirth = dateofbirth)
      : existingPatient.dateofbirth;
    bloodgroup
      ? (existingPatient.bloodgroup = bloodgroup)
      : existingPatient.bloodgroup;
    age ? (existingPatient.age = age) : existingPatient.age;
    address ? (existingPatient.address = address) : existingPatient.address;
    medicalHistory
      ? (existingPatient.medicalHistory = medicalHistory)
      : existingPatient.medicalHistory;

    try {
      // Save updated document
      await existingPatient.save();
    } catch (error) {
      console.error("Error saving patient:", error);
      return res.status(500).send({
        success: false,
        message: "Error occurred while saving the patient!!!",
      });
    }

    // Respond with success message and updated details
    return res.status(200).send({
      success: true,
      message: "Updated Successfully",
      updated_details: existingPatient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    return res.status(500).send({
      success: false,
      message: "Error occurred while updating data!!!",
    });
  }
};

module.exports = {
  getAllDoctors,
  getAllPatients,
  adminlogin,
  registeradmin,
  verified,
  deleteUser,
  getdetails,
  updateDoctor,
  updatePatient,
};
