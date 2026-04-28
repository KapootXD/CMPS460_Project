import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import strawHat from './assets/straw-hat.svg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function LandingPage() {
  return (
    <main className="landing-page">
      <img
        className="hero-image"
        src={strawHat}
        alt="Luffy's straw hat"
      />
      
      <h1>Welcome to OneCafe</h1>
      <p>
        Embark on a grand adventure with every sip! OneCafe brings you the finest coffee inspired by
        the spirit of One Piece. Discover our unique blends and delicious treats in a cozy atmosphere.
      </p>
      <button type="button" className="menu-button">
        Explore Our Menu
      </button>
    </main>
  );
}

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

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
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed.');
      }

      setFeedback({ type: 'success', message: 'Account created successfully.' });
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="signup-page">
      <section className="signup-card" aria-labelledby="signup-title">
        <h1 id="signup-title">Sign Up for OneCafe</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            aria-label="Username"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            aria-label="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            aria-label="Password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            aria-label="Confirm Password"
            required
          />
          <button type="submit" className="signup-button" disabled={isSubmitting}>
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        {feedback.message ? (
          <p className={`signup-feedback ${feedback.type}`}>{feedback.message}</p>
        ) : null}
        <p className="signin-text">
          Already have an account? <a href="#login">Login</a>
        </p>
      </section>
    </main>
  );
}

function App() {
  return (
    <div className="page-shell">
      <header className="top-nav">
        <div className="brand">OneCafe</div>
        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/">Home</NavLink>
          <a href="#menu">Menu</a>
          <a href="#cart">Cart</a>
          <a href="#about">About</a>
          <button type="button" className="nav-action-button">
            Login
          </button>
          <Link to="/signup" className="nav-action-button">Sign Up</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>

      <footer className="page-footer">
        <p>© 2026 OneCafe. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
