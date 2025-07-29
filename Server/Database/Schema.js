import mongoose from "mongoose";


// -------------------- Center Schema --------------------
const centerSchema = new mongoose.Schema({
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },
  managerName: { type: String, required: true },
  contact: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    formattedAddress: { type: String },
    pincode: { type: String }
  },
  helperId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'admin' }],
  deliveryBoys: [{ type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true }],
  pending: [{
    materialName: { type: String },
    totalWeight: { type: Number }
  }],
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'stores' }
}, { timestamps: true });


// -------------------- Store Schema --------------------
const storeSchema = new mongoose.Schema({
  storeManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },
  storeManagerName: { type: String, required: true },
  contact: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    formattedAddress: { type: String },
    pincode: { type: String }
  },
  helpersId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'admin' }],
  deliveryTruck: [{
    containerType: { type: String },
    capacity: { type: Number },
    registrationNo: { type: String }
  }],
  pending: [{
    materialName: { type: String },
    totalWeight: { type: Number }
  }],
  connectedCenters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'centers' }]
}, { timestamps: true });


const centers = mongoose.model('centers', centerSchema);
const stores = mongoose.model('stores', storeSchema);

export { centers, stores };
