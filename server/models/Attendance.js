const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  checkInTime: { type: Date, default: null },
  checkOutTime: { type: Date, default: null },
  status: { type: String, enum: ['present','absent','late','half-day'], default: 'present' },
  totalHours: { type: Number, default: 0 }, // hours as decimal
  createdAt: { type: Date, default: Date.now }
});

// ensure one record per user per date
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
