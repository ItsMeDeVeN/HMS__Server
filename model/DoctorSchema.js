const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
    {
      name: {type: String,  required: true,},
      email: {type: String, required: true,   unique: true,},
      password: {type: String,  required: true,},
      confirmpassword: {type: String,   required: true,},
      contact: {type: String,   required: true,},
      dateofbirth: {type: String,},
      age: {type: Number, },
      consultingfee: { type: Number, },
      department: { type: String,   required: true,},
      address: {type: String, },
      day: {type: String,},
      timeSlot: {type: String,},
      gender: {type: String,},
      role: {type: String,},
      verified:{type: Boolean,},
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Doctor_Details", DoctorSchema);
