import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import SearchAddress from './Address.jsx';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectGetCurUserResult } from '../RTK Query/Selectors';
import { useLazyGetCurrentUserQuery, useUpdateProfileMutation } from '../RTK Query/UserApi';
import { useUser } from '../Contexts/UserContext.jsx';
import {toast} from 'react-hot-toast';

const UpdateDetails = () => {
  const currUserData = useSelector((state) => selectGetCurUserResult(state)?.data );
  const [getCurUser , {data}] = useLazyGetCurrentUserQuery();
  useEffect(() =>{
    if( !userData){
       getCurUser(); 
    } 
  }, [] ); 
  const userData = currUserData || data;
  const currentAddress = userData?.location?.address?.split(' ').slice(0, 5).join(' ');
  const [name, setName] = useState(userData?.name ||'');
  const navigate = useNavigate();
  const { location } = useUser();

  const [updateUser ,{data: UpdatedData}] = useUpdateProfileMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() && !location) return alert("1 field is required");

    if( location?.address === userData?.location?.address && name === userData?.name){
        return alert("No changes are made");
      }
    try {
      await updateUser({name ,location}).unwrap();
      // console.log("user updated successfully")
      // console.log(UpdatedData);
      toast.success('user updated successfully');
      navigate('/');
    } catch (err) {
      toast.error('Updation failed!');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-16 md:mt-20 px-6 py-8 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl sm:font-bold font-semibold text-green-700 mb-6 text-center">Update Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            className="w-full border sm:text-lg border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-left sm:text-base font-medium text-gray-700 mb-1">Address</label>
          <SearchAddress  />
          <label className="block text-left font-medium text-gray-700 mb-1">{currentAddress}</label>
        </div>

        {/* Buttons */}
        <div className="flex text-lg font semibold sm:text-xl gap-4 my-3 pt-4">
          <button
            type="submit"
            className="flex-1 py-2.5 px-4 text-white bg-green-600 rounded hover:bg-green-700 transition-all"
          >
            Update
          </button>
          <button
            type="button"
            // onClick={() => navigate(-1)}
            className="flex-1 py-2.5 px-4 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateDetails;