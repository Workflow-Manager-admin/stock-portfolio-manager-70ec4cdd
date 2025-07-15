import React, { useState, useContext } from 'react';
import { SupabaseContext } from '../App';
import './AuthPage.css';

const AuthPage = () => {
  const supabase = useContext(SupabaseContext);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isLogin) {
        let { error } = await supabase.auth.signInWithPassword({ ...form });
        if (error) setError(error.message);
      } else {
        let { error } = await supabase.auth.signUp({ ...form });
        if (error) setError(error.message);
      }
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  }

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Create Account"}</h2>
      <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          autoFocus
        />
        <input
          required
          type="password"
          placeholder="Password"
          minLength={6}
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit" disabled={submitting} className="btn-auth">
          {submitting ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>
      </form>
      <div className="auth-toggle">
        {isLogin ?
          <span>Don't have an account?{" "}
            <button className="link-btn" onClick={() => setIsLogin(false)}>Sign Up</button>
          </span>
          :
          <span>Already registered?{" "}
            <button className="link-btn" onClick={() => setIsLogin(true)}>Sign in</button>
          </span>
        }
      </div>
    </div>
  );
};

export default AuthPage;
