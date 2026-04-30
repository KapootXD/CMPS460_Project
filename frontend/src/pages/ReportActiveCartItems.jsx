import { useEffect, useState } from 'react';
import ReportShell from '../components/ReportShell';
import { API_URL } from '../data/siteData';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(price ?? 0));
}

function ReportActiveCartItems() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const response = await fetch(`${API_URL}/api/reports/active-cart-items`);
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
      title="Report Page 3: Active Cart Items"
      subtitle="Simple join report for active cart items."
      active="active-cart-items"
    >
      {status === 'loading' ? <p className="reports-state">Loading report...</p> : null}
      {status === 'error' ? <p className="reports-state reports-state--error">{error}</p> : null}
      {status === 'ready' ? (
        <div className="reports-table-wrap">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Cart ID</th>
                <th>Customer ID</th>
                <th>Coffee ID</th>
                <th>Quantity</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`cart-row-${row.cart_id}-${row.coffee_id}-${index}`}>
                  <td>{row.cart_id}</td>
                  <td>{row.customer_id}</td>
                  <td>{row.coffee_id}</td>
                  <td>{row.quantity}</td>
                  <td>{formatPrice(row.unit_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </ReportShell>
  );
}

export default ReportActiveCartItems;
