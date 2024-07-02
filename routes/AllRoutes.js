const express = require('express');
const { registerdoctor, registerpatient, login, forgotpassword, bookappointment, getallpatientappointments} = require('../Controller/usercontroller')
const router = express.Router();

router.post('/registerdoctor', registerdoctor)
router.post('/registerpatient', registerpatient)
router.post('/login', login)
router.post('/forgotpassword', forgotpassword)
router.post('/bookappointment', bookappointment)
router.post('/getallpatientappointments', getallpatientappointments)
// router.delete('/delete', deleteUser)
// router.get('/alluser', getAllUser);
// router.put('/updatedetails', updateDetails);
// router.put('/updatepassword', updatePassword);

module.exports = router;

// middleware 