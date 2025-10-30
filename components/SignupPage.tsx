import React, { useState } from 'react';
import { LogoIcon } from './icons/Icons';

interface SignupPageProps {
  onNavigateToLogin: () => void;
  onSignupSubmit: (data: { fullName: string; username: string; email: string; phone: string; password?: string; }) => void;
}

const SuccessPopup: React.FC<{onClose: () => void}> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-secondary-light p-6 rounded-lg shadow-xl text-center animate-slide-in-up">
        <h2 className="text-2xl font-bold text-primary mb-4">Registration Successful!</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">Your account is now pending administrator approval. You will be able to log in once it has been approved.</p>
        <button onClick={onClose} className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition">
          Got it!
        </button>
      </div>
    </div>
);

const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin, onSignupSubmit }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Basic validation
    if (!formData.fullName || !formData.username || !formData.email || !formData.phone || !formData.password) {
        setError('Please fill out all required fields.');
        return;
    }
    
    onSignupSubmit({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
    });
    setShowSuccess(true);
  };
    
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onNavigateToLogin();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-secondary-dark p-4 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-50 via-gray-100 to-gray-100 dark:from-secondary-dark dark:via-black dark:to-black animate-fade-in">
        {showSuccess && <SuccessPopup onClose={handleCloseSuccess} />}
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-2xl dark:bg-secondary animate-slide-in-up">
        <div className="flex flex-col items-center space-y-2">
          <LogoIcon className="w-16 h-16 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create an Account</h1>
        </div>

        {error && (
            <div className="p-3 text-sm text-center text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                {error}
            </div>
        )}
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" onSubmit={handleSignup}>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
            <select className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600">
                <option>Pakistan</option>
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
                <option>Germany</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender (Optional)</label>
            <select className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600">
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-center space-x-2">
            <input type="checkbox" required id="terms" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
            <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a></label>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full py-3 px-4 text-white bg-primary rounded-lg font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition duration-300 ease-in-out transform hover:scale-105">
              Create Account
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <button onClick={onNavigateToLogin} className="font-medium text-primary hover:underline">Login here</button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;