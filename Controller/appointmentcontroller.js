const Appointment_Details = require("../model/AppointmentSchema");
const DoctorModel = require("../model/DoctorSchema");

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

const getallappointments = async (req, res) => {
  try {
    const { id, role, ...rest } = req.body;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Id is required for fetching all the details",
      });
    }
    if (role === "Patient") {
      const allappointments = await Appointment_Details.find({ patientid: id });
      res.status(200).send({
        success: true,
        message: "All appointments fetched successfully !!!",
        appointments: allappointments,
      });
    } else if (role === "Doctor") {
      const allappointments = await Appointment_Details.find({ docid: id });
      res.status(200).send({
        success: true,
        message: "All appointments fetched successfully !!!",
        appointments: allappointments,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error occured while fetching all appointments",
      errormsg: error,
    });
  }
};

const updateappointmentstatus = async (req, res) => {
  try {
    const { id, ...rest } = req.body;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Id is required to proceed !!!",
      });
    }

    const appointment = await Appointment_Details.findById(id);
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "No such Appointment Slot found !!!",
      });
    }

    if (appointment.appointmentstatus === false) {
      appointment.appointmentstatus = true;
      await appointment.save();
      return res.status(200).send({
        success: true,
        message: "Appointment Approved Successfully !!!",
        appointment: appointment,
      });
    } else if (appointment.appointmentstatus === true) {
      return res.status(409).send({
        success: false,
        message: "Appointment is already approved.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while approving the appointment !!!",
      errormsg: error.message,
    });
  }
};

const deleteappointment = async (req, res) => {
  try {
    const { id, ...rest } = req.body;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Id is required to proceed !!!",
      });
    }

    const appointment = await Appointment_Details.findById(id);
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "No appointment found!!!",
      });
    }

    const deleteData = await appointment.deleteOne();
    if (deleteData) {
      return res.status(200).send({
        success: true,
        message: "Appointment Deleted Successfully !!!",
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Appoinment can't be deleted",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "An error occured while deleting appointment!!!",
      errormsg: error,
    });
  }
};

const allappointmentsdetails = async (req, res) => {
  try {
    const { id, role, ...rest } = req.body;
    if (!id || !role) {
      return res.status(400).send({
        success: false,
        message: "Id & role is required to proceed !!!",
      });
    }

    const totaldocs = await DoctorModel.countDocuments();
    const caridologydoc = await DoctorModel.countDocuments({
      department: "Cardiology",
    });
    const dermatologydoc = await DoctorModel.countDocuments({
      department: "Dermatology",
    });
    const neurologydoc = await DoctorModel.countDocuments({
      department: "Neurology",
    });
    const oncologydoc = await DoctorModel.countDocuments({
      department: "Oncology",
    });
    const pediatricdoc = await DoctorModel.countDocuments({
      department: "Pediatrics",
    });
    const radiologydoc = await DoctorModel.countDocuments({
      department: "Radiology",
    });
    const surgerydoc = await DoctorModel.countDocuments({
      department: "Surgery",
    });
    const gmdoc = await DoctorModel.countDocuments({
      department: "General Medicine",
    });

    const existinguser =
      (await Appointment_Details.findOne({ docid: id })) ||
      (await Appointment_Details.findOne({ patientid: id }));
    if (existinguser) {
      if (role === "Doctor") {
        var totalappointments = await Appointment_Details.countDocuments({
          docid: id,
        });
        var approvedappointments = await Appointment_Details.countDocuments({
          docid: id,
          appointmentstatus: true,
        });
        var pendingappointments = await Appointment_Details.countDocuments({
          docid: id,
          appointmentstatus: false,
        });
      } else if (role === "Patient") {
        var totalappointments = await Appointment_Details.countDocuments({
          patientid: id,
        });
        var approvedappointments = await Appointment_Details.countDocuments({
          patientid: id,
          appointmentstatus: true,
        });
        var pendingappointments = await Appointment_Details.countDocuments({
          patientid: id,
          appointmentstatus: false,
        });
      }
    } else {
      return res.status(404).send({
        success: false,
        message: "No such user Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "All appointment details fetched Successfully!!!",
      totalappointment: totalappointments,
      approvedappointment: approvedappointments,
      pendingappointment: pendingappointments,
      totaldoctors: totaldocs,
      caridologydoc: caridologydoc,
      dermatologydoc: dermatologydoc,
      neurologydoc: neurologydoc,
      oncologydoc: oncologydoc,
      pediatricdoc: pediatricdoc,
      radiologydoc: radiologydoc,
      surgerydoc: surgerydoc,
      gmdoc: gmdoc,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      errormsg: error,
    });
  }
};

module.exports = {
  bookappointment,
  getallappointments,
  updateappointmentstatus,
  deleteappointment,
  allappointmentsdetails,
};
