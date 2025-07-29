import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectGetMyOrderResult } from "../RTK Query/Selectors";
import { useLazyGetMyOrderQuery } from "../RTK Query/AppApi";
import { ChevronDown, ChevronUp } from "lucide-react"; // optional icon
import {staticMaterials} from './Material'

const PreviousOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [GetMyOrder, { data }] = useLazyGetMyOrderQuery();
  const currOrderData = useSelector((state) => selectGetMyOrderResult(state)?.data);
  const userOrder = currOrderData || data;
  const navigate = useNavigate();

  useEffect(() => {
    if (userOrder && Array.isArray(userOrder)) {
      const filtered = userOrder.filter(
        (order) =>
          order?.status?.toLowerCase() === "sold" ||
          order?.status?.toLowerCase() === "cancelled"
      );
      setOrders(filtered);
    }
  }, [userOrder]);

  useEffect(() => {
    if (!userOrder) {
      ;(async () => {
        try {
          const res = await GetMyOrder();
          const fetchedOrders = res?.data?.unsoldOrders;
          if (Array.isArray(fetchedOrders)) {
            const filtered = fetchedOrders.filter(
              (order) =>
                order?.status?.toLowerCase() === "sold" ||
                order?.status?.toLowerCase() === "cancelled"
            );
            setOrders(filtered);
          }
        } catch (err) {
          // console.error("Failed to fetch orders:", err);
        }
      })();
    }
  }, [userOrder, GetMyOrder]);

  const getImageByName = (name) => {
    const found = staticMaterials.find((item) =>
      name.toLowerCase().includes(item.name.toLowerCase())
    );
    return found?.image || "https://via.placeholder.com/150";
  };

  const handleOrderClick = (order) => {
    navigate("/order-details", { state: { order } });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 text-white bg-orange-500 rounded-xl font-semibold text-lg"
      >
        Previous Orders
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-5">
          {orders?.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">No previous orders found.</p>
          ) : (
            orders.map((order, index) => {
              const firstItem = order?.items?.[0];
              const itemName = firstItem?.material || "Unknown Material";
              const itemWeight = firstItem?.weight || "";
              const itemImage = getImageByName(itemName);

              return (
                <div key={index}>
                  <h2 className="text-base font-medium my-1 mx-4">Order {index + 1}</h2>
                  <div
                    onClick={() => handleOrderClick(order)}
                    className="cursor-pointer flex justify-between px-4 border rounded-2xl shadow hover:shadow-lg p-2 transition"
                  >
                    <div>
                      <h2 className="text-lg font-semibold">{itemName}</h2>
                      <h2 className="text-md font-semibold text-orange-400">{itemWeight} (Kg)</h2>
                      <p className="text-sm text-gray-600 mt-1 capitalize">{order.status}</p>
                    </div>
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="w-24 h-16 object-cover rounded-xl mb-3"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default PreviousOrders;
