import mongoose from 'mongoose';


// -------------------- User Schema --------------------
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    profilePic: { type: String, default: "" }, // cloudinary url of the image
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
 kirdar: { type: String ,enum: ['local'],default: 'local'},
}, { timestamps: true });


// -------------------- Admin User Schema --------------------
const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },// formatted permanent address
  phone: { type: String, required: true },
  optionalContact: { type: String },
  adharCardNumber: { type: String, required: true, unique: true },
  adharDocs: { type: String }, // could be Cloudinary URL or file path
  marksheet10: { type: String },
  marksheet12: { type: String },
  offerLetter: { type: String },
  joinLetter: { type: String },
  degree: { type: String },
  degreeDoc: { type: String },
  img:{ type : String },
}, { timestamps: true });

const users = mongoose.model('users', userSchema);
const admin = mongoose.model('admin', adminUserSchema);

export { users , admin };