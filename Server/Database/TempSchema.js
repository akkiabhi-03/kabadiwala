import mongoose from "mongoose";

const malikSchema = new mongoose.Schema({
    name:{ type: String, required: true ,},
    password: { type: String, required: true ,},
    passKey: { type: String, required: true ,},
    aadharNo: { type: Number , required: true ,},
    email: { type: String },
    phone: { type: String, required: true, unique: true },
    kirdar: { type: String ,enum: ['admin'], default: 'admin'},
},{timestamps:true})

const appDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'tempMalik', required: true },
    area: { type: String, required: true, unique: true , default: "Nawabganj"},
    totalPurchase: [{
        material: { type: String },
        weight: { type: Number }
    }],
    pricePerKg: [{
        material: { type: String },
        rate: { type: Number }
    }],
},{timestamps:true})

const appData = mongoose.model('appData', appDataSchema);
const tempMalik = mongoose.model('tempMalik', malikSchema);

export { tempMalik ,appData };