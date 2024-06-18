const express = require('express');
const { registerdoctor, registerpatient, login} = require('../Controller/usercontroller')
const router = express.Router();

router.post('/registerdoctor', registerdoctor)
router.post('/registerpatient', registerpatient)
router.post('/login', login)
// router.delete('/delete', deleteUser)
// router.get('/alluser', getAllUser);
// router.put('/updatedetails', updateDetails);
// router.put('/updatepassword', updatePassword);

module.exports = router;

// middleware 