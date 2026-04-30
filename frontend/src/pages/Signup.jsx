import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../data/siteData';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    password: '',
    confirmPassword: '',
    favorite: 'Luffy',
  });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setFeedback('Passwords do not match.');
      return;
    }
    setLoading(true);
    setFeedback('');
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed');
      setFeedback(`Welcome aboard, ${data.customer.full_name}!`);
      if (typeof window !== 'undefined' && data.customer) {
        window.localStorage.setItem('onecafe-user', JSON.stringify(data.customer));
        if (data.token) {
          window.localStorage.setItem('onecafe-token', data.token);
        }
        window.dispatchEvent(new Event('onecafe-user-changed'));
      }
      setFormData({
        username: '',
        email: '',
        age: '',
        password: '',
        confirmPassword: '',
        favorite: 'Luffy',
      });
      setTimeout(() => navigate('/menu'), 700);
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="oc-page oc-auth auth-signup">
      <div className="auth-bg auth-bg--gray" />
      <section className="auth-frame auth-frame--burst">
        <h1>JOIN THE CREW!</h1>
        <form onSubmit={onSubmit}>
          <label htmlFor="signup-username">CREATE USERNAME</label>
          <input id="signup-username" name="username" value={formData.username} onChange={onChange} required />
          <label htmlFor="signup-email">EMAIL ADDRESS</label>
          <input id="signup-email" name="email" type="email" value={formData.email} onChange={onChange} required />
          <label htmlFor="signup-age">AGE</label>
          <input id="signup-age" name="age" value={formData.age} onChange={onChange} required />
          <label htmlFor="signup-password">CREATE PASSWORD</label>
          <input id="signup-password" name="password" type="password" value={formData.password} onChange={onChange} required />
          <label htmlFor="signup-confirm">CONFIRM PASSWORD</label>
          <input id="signup-confirm" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={onChange} required />
          <label htmlFor="signup-favorite">FAVORITE ONE PIECE CHARACTER</label>
          <select id="signup-favorite" name="favorite" value={formData.favorite} onChange={onChange}>
            <option>Luffy</option>
            <option>Zoro</option>
            <option>Nami</option>
            <option>Sanji</option>
            <option>Robin</option>
            <option>Chopper</option>
            <option>Usopp</option>
            <option>Brook</option>
            <option>Franky</option>
          </select>
          <button className="auth-button auth-button--signup" type="submit" disabled={loading}>
            {loading ? 'BOARDING...' : 'JOIN THE CREW'}
          </button>
        </form>
        {feedback ? <p className="auth-feedback">{feedback}</p> : null}
        <p className="auth-links auth-links--account">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <img className="auth-chopper" src="/onecafe-assets/characters/chopper-peek.png" alt="" />
      </section>
    </main>
  );
}

export default SignupPage;
