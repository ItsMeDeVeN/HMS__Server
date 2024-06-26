const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
    {
      name: {type: String,  required: true,},
      email: {type: String, required: true,   unique: true,},
      password: {type: String,  required: true,},
      confirmpassword: {type: String,   required: true,},
      contact: {type: String,   required: true,},
      dateofbirth: {type: String,},
      age: {type: Number,},
      bloodgroup: { type: String,},
      gender: {type: String,},
      address: {type: String,},
      medicalHistory: {type: String,},
      role: {type: String,},
      verified:{type: Boolean,},
      activation_status:{type: Boolean,},
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Patient_Details", PatientSchema);
