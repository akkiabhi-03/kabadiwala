import { appData } from "../Database/TempSchema.js";

// update price for each material
export const priceUpdate = async (req, res) => {
  try {
    const { area, pricePerKg } = req.body;
    const malikId = req.tempMalik._id;

    if (!area || !Array.isArray(pricePerKg) || pricePerKg.length === 0) {
      return res.status(400).json({ message: 'Area and valid pricePerKg array are required' });
    }

    const existingAppData = await appData.findOne({ area });

    if (!existingAppData) {
      return res.status(404).json({ message: 'appData not found for specified area' });
    }

    existingAppData.pricePerKg = pricePerKg;
    await existingAppData.save();

    res.status(200).json({
      message: 'Price list updated successfully',
      area: existingAppData.area,
      pricePerKg: existingAppData.pricePerKg
    });
  } catch (err) {
    console.error('Price Update Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// update total purchase
export const updateTotalPurchase = async (req, res) => {
  try {
    const { area = "Nawabganj", totalPurchase } = req.body;
    const malikId = req.tempMalik;

    if (!area || !Array.isArray(totalPurchase) || totalPurchase.length === 0) {
      return res.status(400).json({ message: 'Area and valid totalPurchase array are required' });
    }

    const existingAppData = await appData.findOne({ area });

    if (!existingAppData) {
      return res.status(404).json({ message: 'appData not found for specified area' });
    }

    existingAppData.totalPurchase = totalPurchase;
    await existingAppData.save();

    res.status(200).json({
      message: 'Total purchase updated successfully',
      area: existingAppData.area,
      totalPurchase: existingAppData.totalPurchase
    });
  } catch (err) {
    console.error('Total Purchase Update Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// get total purchase and price per kg(rate for particular area)
export const getAppDataByArea = async (req, res) => {
  try {
    const { area = "Nawabganj" } = req.params;
    const malikId = req.tempMalik;

    if (!area) {
      return res.status(400).json({ message: 'Area is required in params' });
    }

    const data = await appData.findOne({ area });

    if (!data) {
      return res.status(404).json({ message: 'appData not found for specified area' });
    }

    res.status(200).json({
      area: data.area,
      totalPurchase: data.totalPurchase,
      pricePerKg: data.pricePerKg,
    });
  } catch (err) {
    console.error('Get App Data Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// create new temp center (appData)
export const createAppData = async (req, res) => {
  try {
    const { area, totalPurchase = [], pricePerKg = [] } = req.body;
    const malikId = req.tempMalik;

    if (!area) {
      return res.status(400).json({ message: 'Area is required' });
    }

    const existing = await appData.findOne({ area });
    if (existing) {
      return res.status(409).json({ message: 'appData already exists for this area' });
    }

    const newData = new appData({
      area,
      totalPurchase,
      pricePerKg
    });

    await newData.save();

    res.status(201).json({
      message: 'appData created successfully',
      appData: newData
    });

  } catch (err) {
    console.error('Create appData Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// give price details to show in app
export const getPrice = async (req, res) => {
  try {
    const { area = "Nawabganj" } = req.params;
    const pricePerKg = await getPriceFn(area);

    return res.status(200).json({ pricePerKg });
  } catch (error) {
    console.error("Get Price Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get all order ( pending or purchased ) ~only by admin
export const getAllOrdersGrouped = async (req, res) => {
  try {
    const malikId = req.tempMalik;
    const { area } = req.params;
    const allOrders = await selldetails.find({});
    const pendingPurchase = [];
    const purchased = [];

    allOrders.forEach(order => {
      if (order.status === "Sold" || order.status === "Cancelled") {
        purchased.push(order);
      } else {
        pendingPurchase.push(order);
      }
    });

    return res.status(200).json({
      message: "Orders fetched successfully",
      pendingPurchase,
      purchased
    });

  } catch (error) {
    console.error("getAllOrdersGrouped Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// delete order by order array (if status is Sold) ~only by admin
export const deleteSoldOrders = async (req, res) => {
  try {
    const { orderIds } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ message: "orderIds array is required" });
    }

    const orders = await selldetails.find({ _id: { $in: orderIds } });

    const toDelete = orders.filter(order => order.status === "Sold").map(order => order._id);
    const skipped = orders.filter(order => order.status !== "Sold").map(order => order._id);

    if (toDelete.length > 0) {
      await selldetails.deleteMany({ _id: { $in: toDelete } });
    }

    return res.status(200).json({
      message: "Delete operation completed",
      deletedCount: toDelete.length,
      deleted: toDelete,
      skipped
    });

  } catch (error) {
    console.error("deleteSoldOrders Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// helper function to get price per kg for each material
export const getPriceFn = async (area = "Nawabganj") => {
  try {
    const appDataDoc = await appData.findOne({ area });

    if (!appDataDoc) {
      console.error(`No appData found for area: ${area}`);
      return [];
    }

    // Return array of { material, rate }
    return appDataDoc.pricePerKg || [];

  } catch (error) {
    console.error("Error in getPriceFn:", error);
    return [];
  }
};

// helper function to update price for each order sold
export const updateTotalPurchaseFn = async (area = "Nawabganj", purchase) => {
  try {
    const appDataDoc = await appData.findOne({ area });

    if (!appDataDoc) {
      console.error(`No appData found for area: ${area}`);
      return;
    }

    purchase.forEach(pItem => {
      const index = appDataDoc.totalPurchase.findIndex(t => t.material === pItem.material);

      if (index !== -1) {
        // Material exists, add weight
        appDataDoc.totalPurchase[index].Weight += pItem.weight;
      } else {
        // Material doesn't exist, push new entry
        appDataDoc.totalPurchase.push({
          material: pItem.material,
          Weight: pItem.weight
        });
      }
    });

    await appDataDoc.save();
    console.log(`Total purchase updated for area "${area}"`);

  } catch (error) {
    console.error("Error in updateTotalPurchaseFn:", error);
  }
};


