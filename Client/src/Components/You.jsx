import React, { useEffect, useRef } from "react";
import {
  Camera,
  UserCog,
  Phone,
  Lock,
  FileText,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectGetCurUserResult } from "../RTK Query/Selectors";
import { useLazyGetCurrentUserQuery, useLogOutMutation } from "../RTK Query/UserApi";
import { toast } from "react-hot-toast";

const YouProfile = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [logOut] = useLogOutMutation();
  const { data: currUserData } = useSelector(selectGetCurUserResult) || {};
  const [getCurUser, { data: lazyUserData }] = useLazyGetCurrentUserQuery();
  const userData = currUserData || lazyUserData;

  useEffect(() => {
    if (!currUserData) {
      getCurUser();
    }
  }, [currUserData, getCurUser]);



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      // console.log("New profile image selected:", imageUrl);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut().unwrap();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed!");
    }
  };

  return (
    <div className="max-w-4xl lg:mt-14 md:mt-12 mx-auto px-2 sm:px-4 md:px-8 py-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6 sm:gap-10 mb-6">
        <div className="relative">
          <img
            src={
              userData?.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                userData?.name || "User"
              )}&background=0D8ABC&color=fff&bold=true`
            }
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2"
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            onClick={() => inputRef.current.click()}
            className="absolute -bottom-1 -right-1 bg-green-600 p-1.5 rounded-full text-white hover:bg-green-700 shadow-md"
          >
            <Camera size={14} />
          </button>
        </div>

        <div className="sm:ml-[6%]">
          <h1 className="text-2xl font-semibold text-gray-800">
            {userData?.name || "Pawan Kumar Bind"}
          </h1>
          <p className="font-semibold text-gray-500">
            {userData?.phone || "7518315870"}
          </p>
        </div>
      </div>

      <p className="text-lg my-4 sm:font-semibold text-gray-500">
        {userData?.location?.address || "Kamtaganj Dostpur Sultanpur"}
      </p>

      {/* Main Actions */}
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200 overflow-hidden">
        <ActionRow
          icon={<UserCog className="text-green-600" />}
          label="Update Profile"
          route="/update-profile"
        />
        <ActionRow
          icon={<Phone className="text-green-600" />}
          label="Contact"
          route="/change_contact"
        />
        <ActionRow
          icon={<Lock className="text-green-600" />}
          label="Change Password"
          route="/change_password"
        />
        <ActionRow
          icon={<FileText className="text-gray-700" />}
          label="Policies & Agreement"
          route="/policies"
        />
        <ActionRow
          icon={<HelpCircle className="text-yellow-600" />}
          label="Help Center"
          route="/help"
        />
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-4 py-6 hover:bg-gray-50 transition text-left"
        >
          <div className="flex items-center gap-3">
            <LogOut className="text-red-500" />
            <span className="text-red-500 font-medium">Logout</span>
          </div>
          <span className="text-sm text-gray-400">{">"}</span>
        </button>
      </div>
    </div>
  );
};

// Reusable Action Row Component
const ActionRow = ({ icon, label, route }) => {
  const navigate = useNavigate();
  return (
    <button
      className="w-full flex items-center justify-between px-4 py-6 hover:bg-gray-50 transition text-left"
      onClick={() => navigate(route)}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-gray-800 font-medium">{label}</span>
      </div>
      <span className="text-sm text-gray-400">{">"}</span>
    </button>
  );
};

export default YouProfile;
