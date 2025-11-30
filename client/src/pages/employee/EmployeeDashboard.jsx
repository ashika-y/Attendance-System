import React, { useEffect, useState } from 'react';
import attendanceService from '../../services/attendanceService';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const d = await attendanceService.fetchEmployeeDashboard();
        if (mounted) setData(d);
      } catch (err) {
        console.error('dashboard load err', err);
        // fallback: try fetchToday if dashboard endpoint isn't available
        try {
          const today = await attendanceService.fetchToday();
          if (mounted) setData({
            todayStatus: today,
            month: { present: 0, absent: 0, late: 0 },
            totalHours: 0,
            recent: []
          });
        } catch (_) { /* ignore */ }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const d = await attendanceService.fetchEmployeeDashboard();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      await attendanceService.checkIn();
      await refresh();
    } catch (err) {
      console.error(err);
      alert('Check-in failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      await attendanceService.checkOut();
      await refresh();
    } catch (err) {
      console.error(err);
      alert('Check-out failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading dashboard...</div>;

  const todayStatus = data?.todayStatus || {};
  const month = data?.month || { present: 0, absent: 0, late: 0 };
  const totalHours = data?.totalHours ?? 0;
  const recent = data?.recent ?? [];

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Employee Dashboard</h1>
        <div>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Logout</button>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 18 }}>
        <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Today's status</div>
          <div style={{ fontSize: 18, marginTop: 8 }}>{todayStatus.status ?? 'Not marked'}</div>
          <div style={{ marginTop: 6, fontSize: 12, color: '#6b7280' }}>
            {todayStatus.checkInTime ? `In: ${todayStatus.checkInTime}` : ''}
            {todayStatus.checkOutTime ? ` • Out: ${todayStatus.checkOutTime}` : ''}
          </div>
        </div>

        <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>This month</div>
          <div style={{ marginTop: 8 }}>
            Present: {month.present} • Absent: {month.absent} • Late: {month.late}
          </div>
        </div>

        <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Total hours (this month)</div>
          <div style={{ fontSize: 18, marginTop: 8 }}>{totalHours}</div>
        </div>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h3>Quick actions</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* Mark attendance */}
          {!todayStatus.checkInTime && (
            <button onClick={handleCheckIn} disabled={actionLoading}>Check In</button>
          )}
          {todayStatus.checkInTime && !todayStatus.checkOutTime && (
            <button onClick={handleCheckOut} disabled={actionLoading}>Check Out</button>
          )}

          {/* View history */}
          <button onClick={() => navigate('/employee/AttendanceHistory')}>My Attendance History</button>

          {/* Monthly summary */}
          <button onClick={() => navigate('/employee/MonthlySummary')}>Monthly Summary</button>

          {/* Dashboard refresh */}
          <button onClick={refresh}>Refresh Dashboard</button>

          {/* Mark attendance page (if you want a dedicated page) */}
          <button onClick={() => navigate('/employee/MarkAttendance')}>Mark Attendance Page</button>
        </div>
      </section>

      <section>
        <h3>Recent attendance (last 7 days)</h3>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>Date</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Check In</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Check Out</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 12 }}>No recent records</td></tr>
              )}
              {recent.map((r) => (
                <tr key={r.date}>
                  <td style={{ padding: 8 }}>{r.date}</td>
                  <td style={{ padding: 8 }}>{r.checkInTime || '-'}</td>
                  <td style={{ padding: 8 }}>{r.checkOutTime || '-'}</td>
                  <td style={{ padding: 8 }}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
