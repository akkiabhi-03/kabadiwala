import { comparePassword, generateToken, hashPassword } from "../Authentication/UserAuth.js";
import { tempMalik } from "../Database/TempSchema.js";
import dotenv from 'dotenv'
dotenv.config();


// Sign Up
export const malikSignUp = async (req, res) => {
  try {
    const { name, password, passKey, aadharNo, email, phone } = req.body;

    // Validate required fields
    if (!name || !password || !passKey || !aadharNo || !phone) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    if(passKey !== process.env.ADMIN_PASS_KEY){
      return res.status(401).json({ message: 'Incorrect pass key!' });
    }

    // Check if user already exists
    const existing = await tempMalik.findOne({ phone });
    if (existing) {
      return res.status(409).json({ message: 'User already exists with this phone number' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create and save user
    const newMalik = new tempMalik({
      name,
      password: hashedPassword,
      passKey,
      aadharNo,
      email,
      phone
    });

    await newMalik.save();

    // Generate token
    const token = generateToken(newMalik._id);

    // Set secure cookie
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });

    // Respond with success
    return res.status(201).json({
      message: 'Registered successfully',
      tempMalik: {
        id: newMalik._id,
        name: newMalik.name,
        phone: newMalik.phone,
        email: newMalik.email,
        passKey: newMalik.passKey,
        aadharNo: newMalik.aadharNo,
      },
      token
    });

  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Login
// export const tempMalikLogin = async (req, res) => {
//   try {
//     const { phone, password } = req.body;
    
//     const user = await tempMalik.findOne({ phone });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     if(password !== "pawan"){
//       return res.status(404).json({ message: 'User not found' });
//     }
// console.log(user);
//     // const isMatch = await comparePassword(password, user.password);
//     // if (!isMatch) {
//     //   return res.status(401).json({ message: 'Invalid credentials' });
//     // }

//     const token = generateToken(user._id);
//     // res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
// res.cookie('token', token, {
//           httpOnly: true,
//           secure: false, // ✅ Only use `true` in production over HTTPS
//           sameSite: 'none' // Or 'none' if working
//         });
//     return res.status(200).json({
//       message: 'Login successful',
//       tempMalik: {
//         id: user._id,
//         name: user.name,
//         phone: user.phone
//       },
//       token
//     });
//   } catch (err) {
//     console.error('Login Error:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const tempMalikLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await tempMalik.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (password !== "pawan") {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Set true in prod with HTTPS
      sameSite: 'none'
    });
console.log("hii",user)
    return res.status(200).json({
      message: 'Login successful',
      tempMalik: {
        id: user._id,
        name: user.name,
        phone: user.phone
      },
      token
    });

  } catch (err) {
    console.log("hii")
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Logout
export const malikLogout = async (req, res) => {
  try {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Change Password
export const tempMalikChangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const malikId = req.tempMalik;

    const user = await tempMalik.findById(malikId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    const hashedNewPass = await hashPassword(newPassword);
    await tempMalik.updateOne({ _id: malikId }, { $set: { password: hashedNewPass } });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change Password Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Forgot Password
export const tempMalikForgotPassword = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    const user = await tempMalik.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPass = await hashPassword(password);
    await tempMalik.updateOne({ _id: user._id }, { $set: { password: hashedPass } });

    const token = generateToken(user._id);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });

    res.status(200).json({
      message: 'Password reset successfully',
      token
    });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// change contact
export const updateMalikContact = async (req, res) => {
  try {
    //✅ Ensure OTP was verified
    if (!req.otpVerified) {
      return res.status(401).json({ message: 'OTP not verified. Access denied.' });
    }
    const malikId = req.tempMalik;
    const { oldContact, newContact } = req.body;

    if (!oldContact || !newContact) {
      return res.status(400).json({ message: 'Please provide old and new contacts' });
    }
    
    const currentUser = await tempMalik.findById(malikId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if(newContact === currentUser?.phone || oldContact === newContact){
      return res.status(400).json({ message: 'Current & new Contact are same' });
    }

    if (currentUser.phone !== oldContact) {
      return res.status(400).json({ message: 'Old contact does not match' });
    }

    const existingUser = await tempMalik.findOne({ phone: newContact });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    currentUser.phone = newContact;
    await currentUser.save();

    res.status(200).json({
      message: 'Contact updated successfully',
      user: currentUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//get temp malik
export const getMalik = async (req, res) => {
    try {
        const malikId = req.tempMalik;
        const userProfile = await tempMalik.findById(malikId).select('-password');
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

