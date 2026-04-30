import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../data/siteData';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [feedback, setFeedback] = useState('');
  const [feedbackTone, setFeedbackTone] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback('');
    setFeedbackTone('');
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid response from server.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Incorrect email or password.');
      }

      if (!data.customer) {
        throw new Error('Login failed: missing customer data.');
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('onecafe-user', JSON.stringify(data.customer));
        if (data.token) {
          window.localStorage.setItem('onecafe-token', data.token);
        } else {
          window.localStorage.removeItem('onecafe-token');
        }
        window.dispatchEvent(new Event('onecafe-user-changed'));
      }
      setFeedbackTone('success');
      setFeedback(`Welcome back, ${data.customer.full_name}!`);
      setFormData({ email: '', password: '' });
      setTimeout(() => navigate('/menu'), 700);
    } catch (error) {
      const message = error instanceof TypeError && error.message === 'Failed to fetch'
        ? 'Cannot reach the server. Is the API running (e.g. docker compose up)?'
        : (error.message || 'Login failed.');
      setFeedbackTone('error');
      setFeedback(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="oc-page oc-auth auth-login">
      <div className="auth-bg auth-bg--gray" />
      <section className="auth-frame">
        <h1>WELCOME BACK, CAPTAIN!</h1>
        <form onSubmit={onSubmit}>
          <label htmlFor="login-email">EMAIL</label>
          <input id="login-email" name="email" type="email" value={formData.email} onChange={onChange} required />
          <label htmlFor="login-password">PASSWORD</label>
          <input id="login-password" name="password" type="password" minLength={8} value={formData.password} onChange={onChange} required />
          <button type="submit" disabled={loading}>{loading ? 'LOADING...' : '⚓ LOGIN'}</button>
        </form>
        {feedback ? (
          <p className={`auth-feedback ${feedbackTone ? `auth-feedback--${feedbackTone}` : ''}`} role="status">
            {feedback}
          </p>
        ) : null}
        <p className="auth-links">
          Forgot your map? <a href="#reset">Password Reset</a>
        </p>
        <p className="auth-links">
          New to the crew? <Link to="/signup">Sign Up</Link>
        </p>
        <img className="auth-chopper" src="/onecafe-assets/characters/chopper-peek.png" alt="" />
      </section>
      <section className="auth-banner auth-banner--full">
        <img src="/onecafe-assets/backgrounds/login-harbor-grayscale.png" alt="Harbor grayscale banner" />
      </section>
    </main>
  );
}

export default LoginPage;
