// Utility to generate HTML table for PDF export from mock data
// Usage: import generateReportHtml from './ReportPdfGenerator';

const mockTableData = [
  // Example row structure, expand as needed
  {
    municipality: 'Lipa City',
    attraction: 'Malarayat Golf Course',
    code: '401',
    local_male: 230,
    local_female: 111,
    other_male: 120,
    other_female: 65,
    foreign_male: 150,
    foreign_female: 172,
    total: 786,
  },
  // ...more rows
];

export default function generateReportHtml(data = mockTableData, title = 'Lipa Tourist Monitoring') {
  let html = `
    <div style='font-family: "Times New Roman", Times, serif;'>
      <h1 style='text-align:center; color:#8B0000;'>${title}</h1>
      <h2 style='text-align:center;'>Tourist Report Table</h2>
      <table style='width:100%; border-collapse:collapse; font-size:14px;'>
        <thead>
          <tr style='background:#ffe066;'>
            <th style='border:1px solid #ccc; padding:6px;'>Municipality</th>
            <th style='border:1px solid #ccc; padding:6px;'>Attraction</th>
            <th style='border:1px solid #ccc; padding:6px;'>Code</th>
            <th style='border:1px solid #ccc; padding:6px;'>Local Male</th>
            <th style='border:1px solid #ccc; padding:6px;'>Local Female</th>
            <th style='border:1px solid #ccc; padding:6px;'>Other Male</th>
            <th style='border:1px solid #ccc; padding:6px;'>Other Female</th>
            <th style='border:1px solid #ccc; padding:6px;'>Foreign Male</th>
            <th style='border:1px solid #ccc; padding:6px;'>Foreign Female</th>
            <th style='border:1px solid #ccc; padding:6px;'>Total</th>
          </tr>
        </thead>
        <tbody>
  `;
  data.forEach(row => {
    html += `
      <tr>
        <td style='border:1px solid #ccc; padding:6px;'>${row.municipality}</td>
        <td style='border:1px solid #ccc; padding:6px;'>${row.attraction}</td>
        <td style='border:1px solid #ccc; padding:6px;'>${row.code}</td>
        <td style='border:1px solid #ccc; padding:6px;'>${row.local_male}</td>
        <td style='border:1px solid #ccc; padding:6px;'>${row.local_female}</td>
        <td style='border:1px solid #ccc; padding:6px;'>${row.other_male}</td>
        <td style='border:1px solid #ccc; padding:6px;'>${row.other_female}</td>
        <td style='border:1px solid #ccc; padding:6px;'>${row.foreign_male}</td>
        <td style='border:1px solid #ccc; padding:6px;'>${row.foreign_female}</td>
        <td style='border:1px solid #ccc; padding:6px;'>${row.total}</td>
      </tr>
    `;
  });
  html += `
        </tbody>
      </table>
    </div>
  `;
  return html;
}
