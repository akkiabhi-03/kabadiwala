import React from "react";
import { PackageSearch } from "lucide-react"; // make sure lucide-react is installed

const NoCurrentOrder = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-10 max-w-md w-full text-center">
        <PackageSearch className="mx-auto h-14 w-14 text-gray-500 mb-4" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
          No Current Order
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          You have no active orders at the moment.
        </p>
      </div>
    </div>
  );
};

export default NoCurrentOrder;
