import { useEffect, useState } from 'react';
import ReportShell from '../components/ReportShell';
import { API_URL } from '../data/siteData';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(price ?? 0));
}

function ReportAvailableCoffees() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const response = await fetch(`${API_URL}/api/reports/available-coffees`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}.`);
        }
        const data = await response.json();
        if (!cancelled) {
          setRows(Array.isArray(data) ? data : []);
          setStatus('ready');
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setRows([]);
          setStatus('error');
          setError(err.message || 'Failed to load report.');
        }
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ReportShell
      title="Report Page 1: Available Coffees"
      subtitle="Simple inventory-style report listing menu items that are currently available."
      active="available"
    >
      {status === 'loading' ? <p className="reports-state">Loading report...</p> : null}
      {status === 'error' ? <p className="reports-state reports-state--error">{error}</p> : null}
      {status === 'ready' ? (
        <div className="reports-table-wrap">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Coffee ID</th>
                <th>Name</th>
                <th>Theme Tag</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.coffee_id}>
                  <td>{row.coffee_id}</td>
                  <td>{row.name}</td>
                  <td>{row.theme_tag ?? '-'}</td>
                  <td>{formatPrice(row.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </ReportShell>
  );
}

export default ReportAvailableCoffees;
