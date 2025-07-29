import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useLogInMutation } from '../RTK Query/UserApi';
import { selectGetCurUserResult } from '../RTK Query/Selectors';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const LoginForm = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLogInMutation();
  const navigate = useNavigate();

  const { data: userData } = useSelector(selectGetCurUserResult) || {};
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Wait until userData is available, then navigate
  useEffect(() => {
    if ( isLoggingIn && userData ) {
      navigate('/');
    }
  }, [isLoggingIn, userData, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!phone) newErrors.phone = 'Phone is required';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const mob = '91' + phone;
      await login({ phone: mob, password }).unwrap();
      toast.success('Logged in successfully!');
      setIsLoggingIn(true); // Triggers useEffect to navigate
      setPhone(''); // ✅ Avoids controlled/uncontrolled warning
      setPassword('');
    } catch (err) {
       console.error('Login failed:', err);
      toast.error(err?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center py-24 min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        <div className="mb-6">
          <label className="block text-left text-gray-700 mb-1">Phone*</label>
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="mb-6 relative">
          <label className="block text-left text-gray-700 mb-1">Password*</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-600 hover:text-blue-600"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="text-right mb-6">
          <Link to="/forgot_password" className="text-blue-500 text-md hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 my-6 text-lg font-bold text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        <div className="mt-6 text-center text-sm">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-500 font-bold text-lg hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
