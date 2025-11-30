// src/pages/employee/MarkAttendance.jsx
import React, { useEffect, useState } from 'react';
import attendanceService from '../../services/attendanceService';

export default function MarkAttendance() {
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadToday = async () => {
    try {
      setLoading(true);
      const d = await attendanceService.fetchToday();
      setToday(d);
    } catch (err) {
      console.error(err);
      alert('Could not load today status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToday();
  }, []);

  const doCheckIn = async () => {
    try {
      setActionLoading(true);
      await attendanceService.checkIn();
      await loadToday();
    } catch (err) {
      console.error(err);
      alert('Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  const doCheckOut = async () => {
    try {
      setActionLoading(true);
      await attendanceService.checkOut();
      await loadToday();
    } catch (err) {
      console.error(err);
      alert('Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div style={{padding:20}}>Loading...</div>;

  return (
    <div style={{padding:20, maxWidth:700, margin:'0 auto'}}>
      <h2>Mark Attendance</h2>

      <div style={{margin:'16px 0', padding:12, border:'1px solid #eee', borderRadius:8}}>
        <div>Today's status: <strong>{today?.status || 'Not marked'}</strong></div>
        <div>Check In: {today?.checkInTime || '-'}</div>
        <div>Check Out: {today?.checkOutTime || '-'}</div>
      </div>

      <div style={{display:'flex', gap:12}}>
        {!today?.checkInTime && (
          <button onClick={doCheckIn} disabled={actionLoading}>Check In</button>
        )}

        {today?.checkInTime && !today?.checkOutTime && (
          <button onClick={doCheckOut} disabled={actionLoading}>Check Out</button>
        )}

        <button onClick={loadToday} disabled={actionLoading}>Refresh</button>
      </div>
    </div>
  );
}
