import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // Heroicons
import SearchAddress from './Address';
import '../../src/App.css'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useUser } from '../Contexts/UserContext';
import OtpVerification from './VerifyOtp.jsx';
import { useSignUpMutation } from '../RTK Query/UserApi.jsx';
import { toast } from 'react-hot-toast';

const SignUp = () => {

  const { location } = useUser();
  const [name ,setName] = useState('');
  const [password ,setPassword] = useState('');
  const [phone ,setPhone] = useState('');
  const [verify , setVerify ] = useState(false);
  const [token ,setToken] = useState('');
  const navigate = useNavigate();
  // console.log(location);


  const [errors, setErrors] = useState({});
  const [showPassword ,setShowPassword] = useState(false)

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!password) newErrors.password = 'Password is required';
    if (!phone) newErrors.phone = 'Phone is required';
    return newErrors;
  };

  const [ SignUp , {data ,isError ,error}] = useSignUpMutation();
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (!name || !password || !phone) {
      setErrors(validationErrors);
      return;
    }
    if( !location ){
      return alert('Address is required');
    }
    setVerify(true);
    // Handle submit logic here
  };

  useEffect(()=>{
    if (!token?.length) return;

    ;(async () => {
      try {
        const response = await SignUp({ name, password, phone, location, token }).unwrap();
        toast.success('SignUp successfully!');
        // console.log('SignUp successful:', response);
        navigate('/');
      } catch (err) {
        // console.error('SignUp failed:', err);
        toast.error('Signup failed!');
        if (err.data && err.data.errors) {
          setErrors(err.data.errors);
        } else {
          setErrors({ general: 'An error occurred during sign up' });
        }
      }
    })();
  },[token])

  return (
    <>
    { verify ? <OtpVerification mobile={phone} setToken={setToken} /> : <div className="flex justify-center py-16 min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-left text-gray-700 mb-1">Name*</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) =>setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>


        {/* Phone */}
        <div className="mb-4">
          <label className="block text-left text-gray-700 mb-1">Phone*</label>
          <PhoneInput country={'in'} value={phone} onChange={(value) => setPhone(value)}
            inputProps={{ name: 'phone', required: true, autoFocus: false, }}
            containerStyle={{ width: '100%' }}
            inputStyle={{ width: '100%', padding: '22px 44px', fontSize: '1rem', border: '1px solid #d1d5db', // Tailwind gray-300
            borderRadius: '0.5rem', outline: 'none', }}
            buttonStyle={{ border: 'none',borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem', background: 'transparent', }} />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-left text-gray-700 mb-1">Address*</label>
          <SearchAddress />
        </div>

        {/* Password */}
        <div className="mb-4  relative">
          <label className="block text-left text-gray-700 mb-1">Password*</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) =>setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-600 hover:text-blue-500"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full text-xl font-bold bg-blue-600 border  text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Verify Contact
        </button>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 text-lg font-bold hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  }
    </>
  );
};

export default SignUp;
