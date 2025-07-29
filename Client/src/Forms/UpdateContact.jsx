import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; // Required CSS
import { useSelector } from 'react-redux';
import { selectGetCurUserResult } from '../RTK Query/Selectors';
import { useLazyGetCurrentUserQuery, useUpdateContactMutation } from '../RTK Query/UserApi';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast';
import OtpVerification from './VerifyOtp.jsx';

const UpdateContact = () => {
  const currUserData = useSelector((state) => selectGetCurUserResult(state)?.data );
  const [getCurUser , {data}] = useLazyGetCurrentUserQuery();
  useEffect(() =>{
    if( !userData){
       getCurUser(); 
    } 
  }, [] ); 
  const userData = currUserData || data;
  const [oldContact, setOldContact] = useState('');
  const [newContact, setNewContact] = useState('');
  const [verify , setVerify ] = useState(false);
  const [token ,setToken] = useState('');
  const navigate = useNavigate();

  const [UpdateContact] = useUpdateContactMutation()
  const handleUpdate = async () => {
    if (!oldContact || !newContact) {
      return alert('Please fill in both fields');
    }
    if( oldContact === newContact){
      return alert("Old and New contact numbers cannot be the same");
    }
    if(newContact === userData?.phone){
      return alert('New contact & current contact are same');
    }
    setVerify(true);
    // try {
    //   await UpdateContact({ oldContact, newContact ,token}).unwrap();
    //   console.log('Contact updated successfully');
    //   toast.success('Contact updated!');
    //   setOldContact('');
    //   setNewContact('');
    //   navigate('/');
    // } catch (err) {
    //   console.error(err);
    //   toast.error('Updation failed!');
    // }
  };

  useEffect(()=>{
      if (!token?.length) return;
  
      ;(async () => {
        try {
          await UpdateContact({ oldContact, newContact ,token}).unwrap();
          // console.log('Contact updated successfully');
          toast.success('Contact updated!');
          setOldContact('');
          setNewContact('');
          navigate('/');
        } catch (err) {
           console.error(err);
           toast.error('Updation failed!');
        }
      })();
    },[token])

  return (
    <>
    { verify ? <OtpVerification mobile={newContact} setToken={setToken} /> : <div className="max-w-md md:max-w-[500px] w-[95vw] mx-auto mt-24 p-6 sm:p-10 bg-white rounded-lg shadow border border-gray-200 space-y-6 sm:space-y-8">
      <h2 className="text-xl sm:text-2xl sm:font-bold font-semibold text-gray-700 text-center">Update Contact</h2>

      <div>
        <label className="block mb-2 text-sm sm:text-base font-medium text-gray-600">Old Contact</label>
        <PhoneInput
          country={'in'}
          value={oldContact}
          onChange={(value) => setOldContact(value)}
          inputProps={{ name: 'oldPhone', required: true, autoFocus: false }}
          containerStyle={{ width: '100%' }}
          inputStyle={{
            width: '100%',
            padding: '22px 44px',
            fontSize: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            outline: 'none',
          }}
          buttonStyle={{
            border: 'none',
            borderTopLeftRadius: '0.5rem',
            borderBottomLeftRadius: '0.5rem',
            background: 'transparent',
          }}
        />
      </div>

      <div>
        <label className="block mb-2 sm:text-base text-sm font-medium text-gray-600">New Contact</label>
        <PhoneInput
          country={'in'}
          value={newContact}
          onChange={(value) => setNewContact(value)}
          inputProps={{ name: 'newPhone', required: true, autoFocus: false }}
          containerStyle={{ width: '100%' }}
          inputStyle={{
            width: '100%',
            padding: '22px 44px',
            fontSize: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            outline: 'none',
          }}
          buttonStyle={{
            border: 'none',
            borderTopLeftRadius: '0.5rem',
            borderBottomLeftRadius: '0.5rem',
            background: 'transparent',
          }}
        />
      </div>

      <button
        onClick={handleUpdate}
        className="w-full py-2.5 my-3 bg-green-600 text-white text-lg sm:text-xl sm:font-bold font-semibold rounded-lg hover:bg-green-700 transition-all duration-300"
      >
        Update Contact
      </button>
    </div>
  }
    </>
  );
};

export default UpdateContact;