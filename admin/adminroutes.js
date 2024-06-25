const express = require('express');
const { getAllDoctors, getAllPatients, adminlogin, registeradmin , verified, deleteUser, getdetails, updateDoctor, updatePatient} = require('./Controller/admincontroller')
const router = express.Router();

router.get('/alldoctors', getAllDoctors);
router.get('/allpatients', getAllPatients);
router.post('/adminlogin', adminlogin);
router.post('/registeradmin', registeradmin);
router.post('/verified', verified);
router.delete('/deleteUser', deleteUser);
router.post('/getdetails', getdetails)
router.post('/updateDoctor', updateDoctor)
router.post('/updatePatient', updatePatient)

module.exports = router;