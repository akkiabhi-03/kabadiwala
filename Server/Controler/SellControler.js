import { selldetails } from "../Database/SellSchema.js";
import { getPriceFn, updateTotalPurchaseFn } from "./StoreCenter.js";

// order new book
export const orderBook = async (req, res) => {
  try {
    const userId = req.user;
    const { items, isSold = false ,area = "Nawabganj" } = req.body;
    // const area = "Nawabganj"; // will be dynamic later

    console.log('booking')
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required and cannot be empty' });
    }
console.log('ready to book')

     const filteredItems = items.filter(item => {
        return (
          item.material &&
          typeof item.material === "string" &&
          item.weight !== "" &&
          !isNaN(item.weight) &&
          Number(item.weight) > 0
        );
      });
    const rawRates = await getPriceFn(area);

    // Convert array to map { material: rate }
    const rateMap = {};
    rawRates.forEach(p => rateMap[p.material] = p.rate);

    const formattedItems = filteredItems.map(item => ({
      material: item.material,
      weight: item.weight
    }));

    const totalPrice = formattedItems.reduce((total, item) => {
      const rate = rateMap[item.material] || 0;
      return total + item.weight * rate;
    }, 0);
console.log('about to book')
    const newOrder = new selldetails({
      userId,
      totalPrice,
      items: formattedItems,
      isSold
    });

    await newOrder.save();
console.log('booked done!')
    return res.status(201).json({
      message: 'Order booked successfully',
      order: newOrder
    });

  } catch (err) {
    console.error('Order Booking Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// edit existing order
export const EditBook = async (req, res) => {
  try {
    const userId = req.user;
    const { items, orderId, isSold = false, area = "Nawabganj", status } = req.body;

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'orderId and valid items array are required' });
    }

    const existingOrder = await selldetails.findOne({ _id: orderId, userId });
    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const rawRates = await getPriceFn(area);
    const rateMap = {};
    rawRates.forEach(p => {
      rateMap[p.material] = p.rate;
    });

    const formattedItems = items.map(item => ({
      material: item.material,
      weight: item.weight,
    }));

    const totalPrice = formattedItems.reduce((total, item) => {
      const rate = rateMap[item.material] || 0;
      return total + item.weight * rate;
    }, 0);

    existingOrder.items = formattedItems;
    existingOrder.totalPrice = totalPrice;
    existingOrder.isSold = isSold;

    // ✅ Only update status if it is exactly "Cancelled"
    if (status == "Cancelled") {
      existingOrder.status = "Cancelled";
    }
    console.log("hello");

    await existingOrder.save();

    return res.status(200).json({
      message: 'Order updated successfully',
      order: existingOrder,
    });

  } catch (err) {
    console.error('Edit Order Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// get my orders
export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user;

    const orders = await selldetails.find({ userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    const PrvOrder = orders.filter(order =>
      order.status === "Cancelled" || order.status === "Sold"
    );

    const CurOrder = orders.filter(order =>
      order.status === "Order Confirmed" || order.status === "Out for Pickup"
    );

    return res.status(200).json({
      message: 'Orders fetched successfully',
      PrvOrder,
      CurOrder
    });

  } catch (err) {
    console.error('Get Order Details Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


//update status (done by only admin -> delebry boy) // update total purchase here
export const UpdateStatus = async (req, res) => {
  try {
    const malikId = req.tempMalik;
    const { orderId, status, area = "Nawabganj" } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: 'orderId and status are required' });
    }

    const validStatuses = ["Order Confirmed", "Out for pickup", "Sold"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find the order
    const order = await selldetails.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the status
    order.status = status;
    await order.save();

    // If status is Sold → update totalPurchase using existing order.items
    if (status === "Sold") {
      await updateTotalPurchaseFn(area, order.items);
    }

    return res.status(200).json({
      message: 'Status updated successfully',
      order
    });

  } catch (err) {
    console.error('UpdateStatus Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




