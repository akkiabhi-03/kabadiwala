import mongoose from 'mongoose';


// -------------------- Sell Schema --------------------
const sellSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  totalPrice: { type: Number, required: true },
  items: [{
    material: { type: String },
    weight: { type: Number }
  }],
  isSold: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["Order Confirmed", "Cancelled" , "Out for Pickup", "Sold"],
    default: "Order Confirmed"
  },
  userInfo:{
    name:{ type: String},
    phone: { type: String },
    location: { type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
        },
        coordinates: { type: [Number] },  // [lng, lat]
        address: { type: String, default: '' },
        pincode:{ type: Number },
        eLoc: {type : String },
    },
  },
  isDeleted: { type: Boolean, default: false },
  centerId: { type: String },
  centerAddress: { type: String },
  storeId: { type: String },
  createdAt: { type: Date, default: Date.now, expires: '60d' } // Auto-delete after 2 months
}, { timestamps: true });

const selldetails = mongoose.model('selldetails', sellSchema);

export { selldetails };