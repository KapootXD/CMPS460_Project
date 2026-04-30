import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatPrice } from '../data/shopData';
import { API_URL } from '../data/siteData';

function getToken() {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.localStorage.getItem('onecafe-token') ?? '';
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown time';
  }
  return date.toLocaleString();
}

function CheckoutPage() {
  const { checkoutId } = useParams();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [checkout, setCheckout] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadCheckout() {
      const token = getToken();
      if (!token) {
        if (!cancelled) {
          setStatus('error');
          setError('Please log in to view checkout details.');
        }
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/checkout/${checkoutId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let data = null;
        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load checkout.');
        }

        if (!cancelled) {
          setCheckout(data.checkout ?? null);
          setItems(Array.isArray(data.items) ? data.items : []);
          setStatus('ready');
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setError(err.message || 'Failed to load checkout.');
        }
      }
    }

    loadCheckout();

    return () => {
      cancelled = true;
    };
  }, [checkoutId]);

  return (
    <main className="oc-page oc-checkout">
      <section className="checkout-card">
        <h1>ORDER CONFIRMED</h1>

        {status === 'loading' ? <p className="checkout-state">Loading checkout...</p> : null}

        {status === 'error' ? (
          <>
            <p className="checkout-state checkout-state--error">{error}</p>
            <div className="checkout-actions">
              <Link to="/login">Login</Link>
              <Link to="/cart">Back To Cart</Link>
            </div>
          </>
        ) : null}

        {status === 'ready' && checkout ? (
          <>
            <div className="checkout-summary">
              <p><strong>Order ID:</strong> #{checkout.checkout_id}</p>
              <p><strong>Captain:</strong> {checkout.customer_name}</p>
              <p><strong>Status:</strong> {String(checkout.order_status || '').toUpperCase()}</p>
              <p><strong>Time:</strong> {formatDate(checkout.created_at)}</p>
              <p className="checkout-total"><strong>Total:</strong> {formatPrice(checkout.total_amount)}</p>
            </div>

            <div className="checkout-table-wrap">
              <table className="checkout-table">
                <thead>
                  <tr>
                    <th>Drink</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={`${checkout.checkout_id}-${item.coffee_id}`}>
                      <td>{item.coffee_name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.unit_price)}</td>
                      <td>{formatPrice(item.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="checkout-actions">
              <Link to="/menu">Back To Menu</Link>
              <Link to="/cart">View Cart</Link>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}

export default CheckoutPage;
