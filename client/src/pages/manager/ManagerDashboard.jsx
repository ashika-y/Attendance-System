// src/pages/manager/ManagerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import attendanceService from "../../services/attendanceService";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const s = typeof attendanceService.fetchTeamDashboard === "function"
          ? await attendanceService.fetchTeamDashboard()
          : await attendanceService.get?.("/manager/dashboard");
        if (mounted) setStats(s ?? null);
      } catch (err) {
        console.error("load team dashboard:", err);
        if (mounted) setStats(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading manager dashboard...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Manager Dashboard</h1>
        <div>
          <button onClick={() => navigate("/manager/attendance")}>View Attendance</button>
          <button onClick={() => navigate("/manager/team-summary")} style={{ marginLeft: 8 }}>Team Summary</button>
        </div>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 16 }}>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Total employees</div>
          <div style={{ fontSize: 20 }}>{stats?.totalEmployees ?? "-"}</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Present today</div>
          <div style={{ fontSize: 20 }}>{stats?.presentToday ?? 0}</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Absent today</div>
          <div style={{ fontSize: 20 }}>{stats?.absentToday ?? 0}</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Late today</div>
          <div style={{ fontSize: 20 }}>{stats?.lateToday ?? 0}</div>
        </div>
      </section>
    </div>
  );
}
