import { selldetails } from "../Database/SellSchema.js";
import { getPriceFn, updateTotalPurchaseFn } from "./StoreCenter.js";


// when admin orders on behalf of user
export const orderByAdmin = async (req, res) => {
  try {
    const malikId = req.tempMalik;
    const { items, isSold = false, area = "Nawabganj", userInfo } = req.body;

    console.log('booking');

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required and cannot be empty' });
    }

    // ✅ Validate userInfo if provided
    if (userInfo) {
      const { name, phone, location } = userInfo || {};

      if (!name || !phone || !location) {
        return res.status(400).json({ message: 'userInfo must include name, phone, and location' });
      }

      const { type, coordinates, address, pincode, eLoc } = location || {};

      if (
        type !== 'Point' ||
        !Array.isArray(coordinates) ||
        coordinates.length !== 2 ||
        typeof coordinates[0] !== 'number' ||
        typeof coordinates[1] !== 'number' ||
        !address ||
        typeof pincode !== 'number' ||
        !eLoc
      ) {
        return res.status(400).json({
          message: 'userInfo.location must include type "Point", [lng, lat] coordinates, address, pincode, and eLoc'
        });
      }
    }

    console.log('ready to book');

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

    console.log('about to book');

    const newOrder = new selldetails({
      totalPrice,
      items: formattedItems,
      isSold,
      ...(userInfo && { userInfo }) // only include if validated
    });

    await newOrder.save();

    console.log('booked done!');

    return res.status(201).json({
      message: 'Order booked successfully',
      order: newOrder
    });

  } catch (err) {
    console.error('Order Booking Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// when admin orders on behalf of user
export const AdminEditBook = async (req, res) => {
  try {
    const malikId = req.tempMalik;
    const { items, orderId, isSold = false, area = "Nawabganj", status } = req.body;

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'orderId and valid items array are required' });
    }

    const existingOrder = await selldetails.findById(orderId);

    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const rawRates = await getPriceFn(area);
    const rateMap = {};
    rawRates.forEach(p => {
      rateMap[p.material] = p.rate;
    });

    // ✅ Filter invalid items (no material, empty weight, zero or invalid weight)
    const filteredItems = items.filter(item => {
      return (
        item.material &&
        typeof item.material === "string" &&
        item.weight !== "" &&
        !isNaN(item.weight) &&
        Number(item.weight) > 0
      );
    });

    if (filteredItems.length === 0) {
      return res.status(400).json({ message: "No valid items provided after filtering" });
    }

    const formattedItems = filteredItems.map(item => ({
      material: item.material,
      weight: Number(item.weight)
    }));

    const totalPrice = formattedItems.reduce((total, item) => {
      const rate = rateMap[item.material] || 0;
      return total + item.weight * rate;
    }, 0);

    existingOrder.items = formattedItems;
    existingOrder.totalPrice = totalPrice;

    if (status && ["Order Confirmed", "Cancelled", "Out for pickup", "Sold"].includes(status)) {
      existingOrder.status = status;
      existingOrder.isSold = status === "Sold";
    } else {
      existingOrder.isSold = isSold;
    }

    if (status === "Sold") {
        await updateTotalPurchaseFn(area, existingOrder.items);
    }

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
