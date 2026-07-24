import React from 'react';

export default function TimetablePanel() {
  return (
    <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Department of Civil Engineering</h2>
        <h3>COEP Technological University</h3>
        <p style={{ color: 'var(--text-muted)' }}>Class: B. Tech | Academic Year: 2026 - 27 | Term: First</p>
      </div>

      <div className="table-container">
        <table className="timetable-table" style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem', width: '60px' }}>TIME<br/>DAY</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>8.30 am<br/>To<br/>9.30 am</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem', width: '20px' }}></th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>9.30 am<br/>To<br/>10.30 am</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem', width: '20px' }}></th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>10.30 am<br/>To<br/>11.30 am</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>11.30 am<br/>To<br/>12.30 pm</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem', backgroundColor: '#e53935', color: 'white', width: '20px' }}></th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>12.30 pm<br/>To<br/>1.30 pm</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem', backgroundColor: '#e53935', color: 'white', width: '20px' }}></th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>1.30 pm<br/>To<br/>2.30 pm</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>2.30 pm<br/>To<br/>3.30 pm</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>3.30 pm<br/>To<br/>4.30 pm</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem', backgroundColor: '#e53935', color: 'white', width: '20px' }}></th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>4.30 pm<br/>To<br/>5.30 pm</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem', backgroundColor: '#e53935', color: 'white', width: '20px' }}></th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>5.30 pm<br/>To<br/>6.30 pm</th>
            </tr>
          </thead>
          <tbody>
            {/* MONDAY */}
            <tr>
              <td style={{ border: '1px solid #ccc', fontWeight: 'bold' }}>MON</td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}>QSV (PRP)<br/>(SC07)</td>
              <td style={{ border: '1px solid #ccc', fontSize: '0.75rem' }}>DE III<br/>IEE (VBD) (NS03)<br/>AFE (RSD) (NC16)<br/>BIM (SES) (SC07)</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#81c784', fontWeight: 'bold' }}>LUNCH<br/>BREAK</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td colSpan="3" style={{ border: '1px solid #ccc' }}>QSV (A) (RSD) (SC07) - ,<br/>EE (MUK) (B)</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#c5e1a5' }}>MDM</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#c5e1a5' }}>MDM</td>
            </tr>
            
            {/* TUESDAY */}
            <tr>
              <td style={{ border: '1px solid #ccc', fontWeight: 'bold' }}>TUE</td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}>QSV (PRP)<br/>(SC07)</td>
              <td style={{ border: '1px solid #ccc', fontSize: '0.75rem' }}>DE III<br/>IEE (VBD) (NS03)<br/>AFE (RSD) (NC16)<br/>BIM (SES) (SC07)</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#81c784', fontWeight: 'bold' }}>LUNCH<br/>BREAK</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', fontSize: '0.75rem' }}>DE IV<br/>DHS (NMM) (SC06)<br/>CTM (GSV) (SC07)<br/>PCS (ARA) (NC16)</td>
              <td colSpan="2" style={{ border: '1px solid #ccc' }}>QSV (B) (RSD) (SC07),<br/>EE (MUK) (C)</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#c5e1a5' }}>MDM</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
            </tr>

            {/* WEDNESDAY */}
            <tr>
              <td style={{ border: '1px solid #ccc', fontWeight: 'bold' }}>WED</td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}>EE (MUK)<br/>(SC07)</td>
              <td style={{ border: '1px solid #ccc', fontSize: '0.75rem' }}>DE III<br/>IEE (VBD) (NS03)<br/>AFE (RSD) (NC16)<br/>BIM (SES) (SC07)</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#81c784', fontWeight: 'bold' }}>LUNCH<br/>BREAK</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', fontSize: '0.75rem' }}>DE IV<br/>DHS (NMM) (SC06)<br/>CTM (GSV) (SC07)<br/>PCS (ARA) (NC16)</td>
              <td colSpan="2" style={{ border: '1px solid #ccc' }}>QSV (C) (PRP) (SC07),<br/>EE (MUK) (D)</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#bbdefb' }}>Expert Lecture</td>
            </tr>

            {/* THURSDAY */}
            <tr>
              <td style={{ border: '1px solid #ccc', fontWeight: 'bold' }}>THU</td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}>EE (MUK)<br/>(SC07)</td>
              <td style={{ border: '1px solid #ccc' }}>EE (MUK)<br/>(SC07)</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#81c784', fontWeight: 'bold' }}>LUNCH<br/>BREAK</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', fontSize: '0.75rem' }}>DE IV<br/>DHS (NMM) (SC06)<br/>CTM (GSV) (SC07)<br/>PCS (ARA) (NC16)</td>
              <td colSpan="2" style={{ border: '1px solid #ccc' }}>QSV (D) (PRP) (SC07),<br/>EE (AUC) (E)</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#ffe0b2' }}>Honour/<br/>Minor</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#ffe0b2' }}>Honour/<br/>Minor</td>
            </tr>

            {/* FRIDAY */}
            <tr>
              <td style={{ border: '1px solid #ccc', fontWeight: 'bold' }}>FRI</td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td colSpan="2" style={{ border: '1px solid #ccc' }}>RM (SS) (NC16)</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#81c784', fontWeight: 'bold' }}>LUNCH<br/>BREAK</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td colSpan="3" style={{ border: '1px solid #ccc' }}>QSV (E) (PRP) (SC07) - ,<br/>EE (MUK) (A)</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#ffe0b2' }}>Honour/<br/>Minor</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#ffe0b2' }}>Honour/<br/>Minor</td>
            </tr>

            {/* SATURDAY */}
            <tr>
              <td style={{ border: '1px solid #ccc', fontWeight: 'bold' }}>SAT</td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#81c784', fontWeight: 'bold' }}>LUNCH<br/>BREAK</td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
              <td style={{ border: '1px solid #ccc', backgroundColor: '#e53935' }}></td>
              <td style={{ border: '1px solid #ccc' }}></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.85rem' }}>
        <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Faculty Allocation</h4>
        <div className="stats-grid">
          <div>
            <p><strong>Quantity Surveying & Valuation (QSV):</strong> Ms. Pratiksha R Patil (PRP)</p>
            <p><strong>Quantity Surveying & Valuation Lab:</strong> Dr. R. S. Dalvi (RSD), Ms. Pratiksha R Patil (PRP)</p>
            <p><strong>Environmental Engineering (EE):</strong> Dr. M. U. Khobragade (MUK)</p>
            <p><strong>Environmental Engineering Lab:</strong> Dr. M. U. Khobragade (MUK)*, Dr. A. U. Charpe (AUC)</p>
            <p><strong>Research Methodology (RM):</strong> Dr. Srashti Singh (SS)</p>
          </div>
          <div>
            <p><strong>DE-III (IEE):</strong> Dr. V. B. Dawari (VBD)</p>
            <p><strong>DE-III (AFE):</strong> Dr. R. S. Dalvi (RSD)</p>
            <p><strong>DE-III (BIM):</strong> Mr. S. E. Shinde (SES)</p>
            <p><strong>DE-IV (PCS):</strong> Dr. A. R. Akhare (ARA)</p>
            <p><strong>DE-IV (DHS):</strong> Dr. N. M. Mohite (NMM)</p>
            <p><strong>DE-IV (CTM):</strong> Dr. G. S. Vyas (GSV)</p>
            <p><strong>MDM-IV (Remote Sensing):</strong> Dr. Srashti Singh (SS)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
