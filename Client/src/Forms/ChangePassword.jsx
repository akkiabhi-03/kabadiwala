import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; 
import { useChangePasswordMutation } from '../RTK Query/UserApi.jsx';
import {toast} from 'react-hot-toast';
// import { toast } from 'react-hot-toast';
// import { useChangePasswordMutation } from '../../RTKQuery/AppApi.jsx';


const ChangePasswordForm = () => {
  const [errors, setErrors] = useState({});
  const [oldPassword , setOldPassword] = useState('')
  const [newPassword , setNewPassword] = useState('')

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const strength = getPasswordStrength(newPassword);

  const validate = () => {
    const newErrors = {};
    if (!oldPassword) newErrors.oldPassword = 'Old password is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    return newErrors;
  };

  const [changePassword ,{data}] = useChangePasswordMutation();
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if(!oldPassword || !newPassword){
      setErrors(validationErrors);
      return;
    }
    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      toast.success('Password Updated Sucessfully!');
      // console.log(data);
      setOldPassword('');
      setNewPassword('');
      setErrors({});
      navigate('/'); 

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center pt-24 pb-42 min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Change Password</h2>

        {/* Old Password */}
        <div className="mb-6 relative">
          <label className="block text-left text-gray-700 mb-1">Old Password*</label>
          <input
            type={showOldPassword ? 'text' : 'password'}
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => {setOldPassword(e.target.value)}}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-[38px] text-gray-600 hover:text-blue-600"
          >
            {showOldPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
          {errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div className="mb-6 relative">
          <label className="block text-left text-gray-700 mb-1">New Password*</label>
          <input
            type={showNewPassword ? 'text' : 'password'}
            name="newPassword"
            value={newPassword}
            onChange={(e) => {setNewPassword(e.target.value)}}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-[38px] text-gray-600 hover:text-blue-600"
          >
            {showNewPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>

          {/* Password Strength */}
          <div className="mb-4">
            {newPassword && (
              <p className={`text-sm font-medium ${strength.color}`}>
                Strength: {strength.label}
              </p>
            )}
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

        </div>

        <button
          type="submit"
          className="w-full text-xl font-bold bg-blue-600 my-6 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

const getPasswordStrength = (password) => {
  if (password.length < 6) return { label: 'Too short', color: 'text-red-500' };
  if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/))
    return { label: 'Strong', color: 'text-green-600' };
  if (password.match(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/))
    return { label: 'Moderate', color: 'text-yellow-600' };
  return { label: 'Weak', color: 'text-red-500' };
};

export default ChangePasswordForm;