// attendanceController.js
const Attendance = require('../models/Attendance');

// helper to format YYYY-MM-DD in local date (not UTC)
function formatDateLocal(d) {
  const dt = new Date(d);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// helper: set a time on a date (local)
function setTimeOnDate(date, hours, minutes) {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

exports.checkIn = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const now = new Date();
    const dateStr = formatDateLocal(now);

    let record = await Attendance.findOne({ userId: user._id, date: dateStr });

    if (record && record.checkInTime) {
      return res.status(400).json({ message: 'Already checked in for today' });
    }

    // office start time (adjust if you want)
    const officeStart = setTimeOnDate(now, 9, 30); // 09:30 local
    const status = now > officeStart ? 'late' : 'present';

    if (!record) {
      record = new Attendance({
        userId: user._id,
        date: dateStr,
        checkInTime: now,
        status
      });
    } else {
      record.checkInTime = now;
      // if previously marked absent or something, update status
      record.status = status;
    }

    await record.save();
    return res.json({ message: 'Checked in', record });
  } catch (err) {
    // duplicate index possible if two parallel requests
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Attendance record conflict, try again' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const user = req.user;
    const now = new Date();
    const dateStr = formatDateLocal(now);

    const record = await Attendance.findOne({ userId: user._id, date: dateStr });
    if (!record || !record.checkInTime) {
      return res.status(400).json({ message: 'No check-in found for today' });
    }
    if (record.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out for today' });
    }

    record.checkOutTime = now;

    // compute hours difference in decimal
    const ms = record.checkOutTime.getTime() - record.checkInTime.getTime();
    const hours = Math.max(0, ms / 1000 / 3600);
    record.totalHours = Math.round(hours * 100) / 100; // round to 2 decimals

    // If worked hours less than 4 -> half-day (adjust threshold)
    if (record.totalHours > 0 && record.totalHours < 4) {
      record.status = 'half-day';
    }

    await record.save();
    return res.json({ message: 'Checked out', record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.myHistory = async (req, res) => {
  try {
    const user = req.user;
    const { month } = req.query; // format YYYY-MM, optional
    const query = { userId: user._id };

    if (month) {
      const from = `${month}-01`; // e.g. 2025-11-01
      const nextMonth = new Date(from);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      query.date = { $gte: formatDateLocal(new Date(from)), $lt: formatDateLocal(nextMonth) };
    }

    const records = await Attendance.find(query).sort({ date: -1 });
    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.todayStatus = async (req, res) => {
  try {
    const user = req.user;
    const today = formatDateLocal(new Date());
    const record = await Attendance.findOne({ userId: user._id, date: today });
    if (!record) return res.json({ status: 'not_checked_in', record: null });
    return res.json({ status: record.checkInTime ? (record.checkOutTime ? 'checked_out' : 'checked_in') : 'not_checked_in', record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
