const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/attendanceController');

// employee-only routes (auth required)
router.post('/checkin', auth, ctrl.checkIn);
router.post('/checkout', auth, ctrl.checkOut);
router.get('/my-history', auth, ctrl.myHistory);
router.get('/today', auth, ctrl.todayStatus);

module.exports = router;
