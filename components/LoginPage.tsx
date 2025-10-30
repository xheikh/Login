import React, { useState } from 'react';
import { LogoIcon, LoginIcon, ForgotPasswordIcon, CreateAccountIcon } from './icons/Icons';
import { User } from '../types';

interface LoginPageProps {
  onNavigateToSignup: () => void;
  onLoginSuccess: (user: User) => void;
  users: User[];
  appName: string;
  allowRegistration: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToSignup, onLoginSuccess, users, appName, allowRegistration }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user || user.password !== password) {
      setError('Invalid credentials. Please check your username and password.');
      return;
    }

    switch(user.status) {
        case 'Active':
            onLoginSuccess(user);
            break;
        case 'Inactive':
            setError('Your account is inactive. Please contact an administrator.');
            break;
        case 'Blocked':
            setError('Your account has been blocked by an administrator.');
            break;
        case 'Pending':
            setError('Your account is pending administrator approval.');
            break;
        default:
            setError('Could not verify account status. Please contact support.');
            break;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-secondary-dark p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-gray-200 dark:from-secondary-dark dark:via-secondary-dark dark:to-black animate-fade-in">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl dark:bg-secondary animate-slide-in-up">
        <div className="flex flex-col items-center space-y-2">
          <LogoIcon className="w-20 h-20 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{appName} Login</h1>
        </div>

        {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                {error}
            </div>
        )}
        
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600"
              placeholder="e.g., admin, johndoe"
            />
          </div>
          <div>
            <label htmlFor="password"  className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 text-white bg-primary rounded-lg font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <LoginIcon className="w-5 h-5" />
            Login
          </button>
        </form>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <button className="w-full flex justify-center items-center gap-2 py-2 px-4 text-sm text-primary-dark dark:text-primary-light bg-teal-50 dark:bg-secondary-light rounded-lg hover:bg-teal-100 dark:hover:bg-gray-600 transition duration-300">
            <ForgotPasswordIcon className="w-4 h-4" />
            Forgot Password
          </button>
          {allowRegistration && (
            <button 
              onClick={onNavigateToSignup}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 text-sm text-primary-dark dark:text-primary-light bg-teal-50 dark:bg-secondary-light rounded-lg hover:bg-teal-100 dark:hover:bg-gray-600 transition duration-300"
            >
              <CreateAccountIcon className="w-4 h-4" />
              Create New Account
            </button>
          )}
        </div>
      </div>
      <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        © 2025 {appName}. All Rights Reserved.
      </footer>
    </div>
  );
};

export default LoginPage;