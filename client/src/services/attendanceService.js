// src/services/attendanceService.js
import api from '../api/api';

export default {
  fetchEmployeeDashboard: async () => {
    const res = await api.get('/dashboard/employee');
    return res.data;
  },

  checkIn: async () => {
    const res = await api.post('/attendance/checkin');
    return res.data;
  },

  checkOut: async () => {
    const res = await api.post('/attendance/checkout');
    return res.data;
  },

  fetchMyHistory: async (params = {}) => {
    // params can include { month, year, page, limit }
    const res = await api.get('/attendance/my-history', { params });
    return res.data; // expect array of records
  },

  fetchMySummary: async (month, year) => {
    const res = await api.get('/attendance/my-summary', { params: { month, year }});
    return res.data; // { present, absent, late, halfDay, totalHours }
  },

  fetchToday: async () => {
    const res = await api.get('/attendance/today');
    return res.data; // today's record
  }
};
