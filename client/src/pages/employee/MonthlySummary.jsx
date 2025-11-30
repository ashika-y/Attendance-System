// src/pages/employee/MonthlySummary.jsx
import React, { useEffect, useState } from 'react';
import attendanceService from '../../services/attendanceService';

export default function MonthlySummary() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const s = await attendanceService.fetchMySummary(month, year);
      setSummary(s);
    } catch (err) {
      console.error(err);
      alert('Could not load summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [month, year]);

  if (loading) return <div style={{padding:20}}>Loading summary...</div>;

  return (
    <div style={{padding:20, maxWidth:700, margin:'0 auto'}}>
      <h2>Monthly Summary</h2>

      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <select value={month} onChange={e => setMonth(Number(e.target.value))}>
          {Array.from({length:12}).map((_,i) => <option key={i+1} value={i+1}>{i+1}</option>)}
        </select>
        <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} style={{width:120}} />
        <button onClick={load}>Refresh</button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
        <div style={{padding:12, border:'1px solid #eee', borderRadius:8}}>
          <div style={{fontSize:12, color:'#6b7280'}}>Present</div>
          <div style={{fontSize:22}}>{summary?.present ?? 0}</div>
        </div>

        <div style={{padding:12, border:'1px solid #eee', borderRadius:8}}>
          <div style={{fontSize:12, color:'#6b7280'}}>Absent</div>
          <div style={{fontSize:22}}>{summary?.absent ?? 0}</div>
        </div>

        <div style={{padding:12, border:'1px solid #eee', borderRadius:8}}>
          <div style={{fontSize:12, color:'#6b7280'}}>Late</div>
          <div style={{fontSize:22}}>{summary?.late ?? 0}</div>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <strong>Total hours:</strong> {summary?.totalHours ?? 0}
      </div>
    </div>
  );
}
