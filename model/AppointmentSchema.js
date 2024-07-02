const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    docid: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    docname: { type: String, required: true },
    patientid: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    slot: {
      day: { type: String, required: true },
      timeSlot: { type: String, required: true }
    },
    slotid: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment_Details", AppointmentSchema);
