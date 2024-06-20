const express = require('express');
const { getAllDoctors, getAllPatients, adminlogin, registeradmin } = require('./Controller/admincontroller')
const router = express.Router();

router.get('/alldoctors', getAllDoctors);
router.get('/allpatients', getAllPatients);
router.post('/adminlogin', adminlogin);
router.post('/registeradmin', registeradmin);

module.exports = router;