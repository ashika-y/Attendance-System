// src/pages/manager/EmployeesAttendance.jsx
import React, { useEffect, useState } from "react";
import attendanceService from "../../services/attendanceService";
import { exportCsv } from "../../utils/exportCsv";

function formatDateOnly(d) {
  if (!d) return "-";
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString();
}

export default function EmployeesAttendance() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({ employeeId: "", from: "", to: "", status: "" });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        if (typeof attendanceService.fetchAllEmployees === "function") {
          const e = await attendanceService.fetchAllEmployees();
          setEmployees(Array.isArray(e) ? e : (e?.data ?? []));
        }
        await fetchRecords();
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchRecords() {
    setLoading(true);
    try {
      if (typeof attendanceService.fetchAllAttendance === "function") {
        const res = await attendanceService.fetchAllAttendance(filters);
        setRecords(Array.isArray(res) ? res : (res?.data ?? []));
      } else {
        const res = await attendanceService.get?.("/manager/attendance", { params: filters });
        setRecords(Array.isArray(res) ? res : (res?.data ?? []));
      }
    } catch (err) {
      console.error("fetchRecords:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  function onFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({ employeeId: "", from: "", to: "", status: "" });
    fetchRecords();
  }

  function handleExport() {
    const rows = records.map(r => ({
      employeeId: r.employeeId ?? r.employee?.id ?? "",
      employeeName: r.employeeName ?? r.employee?.name ?? r.name ?? "",
      date: r.date ?? r.recordDate ?? formatDateOnly(r.createdAt) ?? "",
      checkIn: r.checkInTime ?? r.inTime ?? "",
      checkOut: r.checkOutTime ?? r.outTime ?? "",
      status: r.status ?? ""
    }));
    exportCsv(`attendance-export-${new Date().toISOString().slice(0,10)}.csv`, rows);
  }

  if (loading) return <div style={{ padding: 20 }}>Loading attendance...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>All Employees Attendance</h2>
        <div>
          <button onClick={handleExport} style={{ marginRight: 8 }}>Export CSV</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 12, alignItems: "center" }}>
        <select value={filters.employeeId} onChange={e => onFilterChange("employeeId", e.target.value)}>
          <option value="">All employees</option>
          {employees.map(emp => (
            <option key={emp.id ?? emp.employeeId} value={emp.id ?? emp.employeeId}>
              {emp.name ?? emp.fullName ?? emp.username}
            </option>
          ))}
        </select>

        <input type="date" value={filters.from} onChange={e => onFilterChange("from", e.target.value)} />
        <input type="date" value={filters.to} onChange={e => onFilterChange("to", e.target.value)} />

        <select value={filters.status} onChange={e => onFilterChange("status", e.target.value)}>
          <option value="">Any status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>

        <button onClick={fetchRecords}>Apply</button>
        <button onClick={clearFilters}>Clear</button>
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>Employee</th>
              <th style={{ textAlign: "left", padding: 8 }}>Date</th>
              <th style={{ textAlign: "left", padding: 8 }}>Check In</th>
              <th style={{ textAlign: "left", padding: 8 }}>Check Out</th>
              <th style={{ textAlign: "left", padding: 8 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && <tr><td colSpan={5} style={{ padding: 12 }}>No records found</td></tr>}
            {records.map((r, i) => (
              <tr key={r.id ?? i}>
                <td style={{ padding: 8 }}>{r.employeeName ?? r.employee?.name ?? r.name ?? ""}</td>
                <td style={{ padding: 8 }}>{r.date ?? r.recordDate ?? formatDateOnly(r.createdAt)}</td>
                <td style={{ padding: 8 }}>{r.checkInTime ?? r.inTime ?? "-"}</td>
                <td style={{ padding: 8 }}>{r.checkOutTime ?? r.outTime ?? "-"}</td>
                <td style={{ padding: 8 }}>{r.status ?? (r.checkInTime ? "Present" : "Absent")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
