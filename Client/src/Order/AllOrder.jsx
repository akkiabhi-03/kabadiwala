import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NoCurrentOrder from './NoBooking.jsx';
import OrderUserDetails from './UserInfo.jsx';
import { selectGetMyOrderResult } from "../RTK Query/Selectors.jsx";
import { useLazyGetMyOrderQuery } from "../RTK Query/AppApi.jsx";
import MyOrder from "./MyOrders.jsx";

const AllOrders = () => {
  const [Orders, setOrders] = useState([]);
  const currOrderData = useSelector((state) => selectGetMyOrderResult(state)?.data);
  const [GetMyOrder, { data }] = useLazyGetMyOrderQuery();
  const userOrder = currOrderData || data;

  useEffect(() => {
    if (!userOrder) {
      ;(async () => {
        try {
          const res = await GetMyOrder();
          const fetchedOrder = res?.data?.CurOrder;
          if (fetchedOrder) {
            setOrders(fetchedOrder || []);
          }
        } catch (err) {
          // console.error("Failed to fetch order:", err);
        }
      })();
    }
  }, [userOrder]);

  useEffect(() => {
    if (userOrder?.CurOrder?.length > 0) {
      setOrders(userOrder.CurOrder || []);
    }
  }, [userOrder]);

  return (
    <div>
      {Orders.length > 0 ? <MyOrder orders={Orders} /> : <NoCurrentOrder />}
      <OrderUserDetails />
      <div className="h-12 md:hidden"></div>
    </div>
  );
};

export default AllOrders;
