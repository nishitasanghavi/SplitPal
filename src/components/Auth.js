import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = storedUsers.find(u => u.username === username);

    if (!user) {
      setError('User not found. Please sign up.');
      return;
    }

    const hashedPassword = hashPassword(password);
    if (hashedPassword !== user.hashedPassword) {
      setError('Invalid password.');
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    navigate('/dashboard');
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = storedUsers.find(u => u.username === username);
    if (existingUser) {
      setError('An account with this email already exists. Please log in.');
      return;
    }

    const hashedPassword = hashPassword(password);
    const newUser = {
      username,
      hashedPassword,
    };

    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    navigate('/dashboard');
  };

  const hashPassword = (password) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = (hash << 5) - hash + password.charCodeAt(i);
      hash &= hash;
    }
    return hash.toString();
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4">
        <h2 className={`text-center mb-4 ${isSignUp ? 'text-green' : 'text-success'}`}>
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className={`form-label ${isSignUp ? 'text-green' : 'text-success'}`}>Email address</label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className={`form-label ${isSignUp ? 'text-green' : 'text-success'}`}>Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {isSignUp && (
            <div className="mb-3">
              <label htmlFor="exampleInputPassword2" className={`form-label ${isSignUp ? 'text-green' : 'text-success'}`}>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          <button type="submit" className={`btn ${isSignUp ? 'btn-green' : 'btn-success'} w-100`}>
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p className={`mt-3 text-center ${isSignUp ? 'text-green' : 'text-success'}`}>
          {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
          <button className={`btn btn-link ${isSignUp ? 'text-green' : 'text-success'}`} onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
