// src/utils/exportCsv.js
export function exportCsv(filename, rows) {
  if (!rows || !rows.length) {
    alert("No data to export");
    return;
  }
  const header = Object.keys(rows[0]);
  const csv = [
    header.join(","),
    ...rows.map(row =>
      header.map(field => {
        const v = row[field] ?? "";
        return `"${String(v).replace(/"/g, '""')}"`;
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "export.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
