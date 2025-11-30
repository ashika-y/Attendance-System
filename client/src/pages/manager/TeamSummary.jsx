// src/pages/manager/TeamSummary.jsx
import React, { useEffect, useState } from "react";
import attendanceService from "../../services/attendanceService";

export default function TeamSummary() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const s = typeof attendanceService.fetchTeamSummary === "function"
        ? await attendanceService.fetchTeamSummary(month, year)
        : await attendanceService.get?.("/manager/summary", { params: { month, year } });
      setSummary(s);
    } catch (err) {
      console.error("fetch team summary:", err);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [month, year]);

  if (loading) return <div style={{ padding: 20 }}>Loading team summary...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select value={month} onChange={e => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }).map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
        </select>
        <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} style={{ width: 120 }} />
        <button onClick={load}>Refresh</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Total Present</div>
          <div style={{ fontSize: 20 }}>{summary?.totalPresent ?? 0}</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Total Absent</div>
          <div style={{ fontSize: 20 }}>{summary?.totalAbsent ?? 0}</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Total Late</div>
          <div style={{ fontSize: 20 }}>{summary?.totalLate ?? 0}</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Avg hours / employee</div>
          <div style={{ fontSize: 20 }}>{summary?.avgHoursPerEmployee ?? 0}</div>
        </div>
      </div>

      {summary?.byEmployee && (
        <div style={{ marginTop: 16 }}>
          <h3>Breakdown</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f9fafb" }}>
              <tr>
                <th style={{ padding: 8, textAlign: "left" }}>Employee</th>
                <th style={{ padding: 8, textAlign: "left" }}>Present</th>
                <th style={{ padding: 8, textAlign: "left" }}>Absent</th>
                <th style={{ padding: 8, textAlign: "left" }}>Late</th>
                <th style={{ padding: 8, textAlign: "left" }}>Hours</th>
              </tr>
            </thead>
            <tbody>
              {summary.byEmployee.map(emp => (
                <tr key={emp.id}>
                  <td style={{ padding: 8 }}>{emp.name}</td>
                  <td style={{ padding: 8 }}>{emp.present}</td>
                  <td style={{ padding: 8 }}>{emp.absent}</td>
                  <td style={{ padding: 8 }}>{emp.late}</td>
                  <td style={{ padding: 8 }}>{emp.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
