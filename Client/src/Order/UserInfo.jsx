import React, { useEffect } from "react";
import { User, Phone, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import { useLazyGetCurrentUserQuery } from "../RTK Query/UserApi.jsx";
import { selectGetCurUserResult } from "../RTK Query/Selectors.jsx";


const OrderUserDetails = () => {


  const currUserData = useSelector((state) => selectGetCurUserResult(state)?.data);
  const [getCurUser, { data: lazyUserData }] = useLazyGetCurrentUserQuery();

  useEffect(() => {
    if (!currUserData) {
      getCurUser();
    }
  }, [currUserData, getCurUser]);

  const user = currUserData || lazyUserData;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* User Info */}
      <div className="bg-white rounded-2xl shadow-lg border border-green-500 p-6 space-y-5">
        <h2 className="text-xl font-bold text-green-700 border-b border-green-500 pb-2">Pickup Details</h2>

        <div className="flex items-start gap-4">
          <User className="text-green-600 w-5 h-5 mt-1" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Name</p>
            <p className="text-md text-gray-600">{user?.name || "Pawan Kumar Bind"}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Phone className="text-green-600 w-5 h-5 mt-1" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Contact</p>
            <p className="text-md text-gray-600">{user?.phone || "751831 5870"}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MapPin className="text-green-600 w-5 h-5 mt-1" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Address</p>
            <p className="text-md text-gray-600">
              {user?.location?.address || "Kamtaganj, Dostpur, Sultanpur, UP"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderUserDetails;
