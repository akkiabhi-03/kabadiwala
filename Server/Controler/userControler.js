import { users } from '../Database/UserSchema.js';
import cloudinary from '../Database/Cloudinary.js';
import fs from 'fs';
import { comparePassword, generateToken, hashPassword } from '../Authentication/UserAuth.js';

// signup controller to handle user registration
export const signUp = async (req, res) => {
  try {
    // ✅ Ensure OTP was verified
    if (!req.otpVerified) {
      return res.status(401).json({ message: 'OTP not verified. Access denied.' });
    }

    const { name, password, phone, location } = req.body;

    if (!name || !password || !phone || !location || !location.coordinates || !Array.isArray(location.coordinates)) {
      return res.status(400).json({ message: 'All fields including valid location are required' });
    }

    const [lng, lat] = location.coordinates;
    if (typeof lng !== 'number' || typeof lat !== 'number' || location.coordinates.length !== 2) {
      return res.status(400).json({ message: 'Invalid location coordinates' });
    }

    const existingUser = await users.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new users({
      name,
      password: hashedPassword,
      phone,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
        address: location.address || '',
        pincode: location.pincode || null,
        eLoc: location.eLoc || ''
      }
    });

    await newUser.save();

    const token = generateToken(newUser._id);
        // use this in production
        // res.cookie('token', token, {
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: 'none'
        // });
        res.cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          domain: '.kabadiwala.onrender.com',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).json({message: 'User created successfully'});



    // res.status(201).json({
    //   message: 'User created successfully',
    //   user: {
    //     id: newUser._id,
    //     name: newUser.name,
    //     phone: newUser.phone,
    //     location: newUser.location
    //   },
    //   token
    // });
  } catch (err) {
    console.error('❌ signUp error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// login controller to handle user authentication
export const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const existingUser = await users.findOne({ phone });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid phone or password' });
        }
        const isMatch = await comparePassword(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid phone or password' });
        }
        const token = generateToken(existingUser._id);
        return res.cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          domain: '.kabadiwala.onrender.com',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).json({message: 'Login successful'});
        // return res.status(200).json({
        //   message: 'Login successful',
        //   user: {
        //     _id: existingUser._id,
        //     username: existingUser.username,
        //     email: existingUser.email,
        //     // add other safe fields only
        //   }
        // });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// logout controller to handle user logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// get Current user profile controller to fetch user details
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user;
        console.log("hiiii!")
        const userProfile = await users.findById(userId).select('-password');
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// update user (name , location)
export const updateUser = async (req, res) => {
  try {
    const userId = req.user;
    const { name,  location } = req.body;

    if (!name && !location) {
      return res.status(400).json({ message: 'Please provide at least one field to update' });
    }

    const updateFields = {};

    if (name) updateFields.name = name;

    if (location) {
      const { coordinates, address, pincode, eLoc } = location;

      if (
        !coordinates ||
        !Array.isArray(coordinates) ||
        coordinates.length !== 2 ||
        typeof coordinates[0] !== 'number' ||
        typeof coordinates[1] !== 'number'
      ) {
        return res.status(400).json({ message: 'Invalid location coordinates' });
      }

      updateFields.location = {
        type: 'Point',
        coordinates,
        address: address || '',
        pincode: pincode || null,
        eLoc: eLoc || ''
      };
    }

    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('hii!')
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error('❌ Error updating user:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//update Profile image
export const uploadMedia = async (req, res) => {
  try {
    const userId = req.user._id;

    // Handle profilePic upload
    if (req.files?.profilePic) {
      const profile = req.files.profilePic[0];
      const result = await cloudinary.uploader.upload(profile.path, {
        folder: 'profiles',
      });

      uploads.profilePic = result.secure_url;

      // ✅ Save to DB
      await users.findByIdAndUpdate(
        userId,
        { profilePic: result.secure_url },
        { new: true, runValidators: true }
      );

      // 🧹 Remove temp file
      fs.unlinkSync(profile.path);
    }

    res.status(200).json({
      message: 'Upload successful and profile updated',
      ...uploads,
    });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// change password controller
export const changePassword = async( req , res ) =>{
    try {
        const { oldPassword ,newPassword} = req.body;
       console.log('hi')
        const userName = req.user; 
        const User = await users.findById(userName);
        if (!User) {
            return res.status(404).send('User not found');
        }
        // match oldPassword with saved password      
        const correctPass = await comparePassword( oldPassword , User.password); 
        if( correctPass != true ){ 
            return res.status(404).send('Incorrect Password');
        }
        // save new password in incripted form
        const bcryptedPass = await hashPassword( newPassword, 10);
        await users.updateOne({_id : userName} ,{$set: { password: bcryptedPass }});

        // save new password in incripted form 
        return res.status(200).json('password updated successfully');

    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal server error')
    }
}

// forgot password controller 
export const forgotPassword = async ( req , res ) =>{
    try {
      // if (!req.otpVerified) {
      //   return res.status(401).json({ message: 'OTP not verified. Access denied.' });
      // }
      const { phone ,password } = req.body;
      console.log(phone)
      console.log(password);
      if(!phone || !password){
        return res.status(400).json({ message: 'Phone & password required!' });
      }

      const User = await users.findOne({phone});
      if (!User) {
          return res.status(404).send('User not found');
      }
      console.log("hiihello");
      // save this password in increpted form
      const bcryptedPass = await hashPassword(password); 
      await users.updateOne({_id : User._id} ,{$set: { password: bcryptedPass }});
      console.log("hello");

      const token = generateToken(User._id);
        // use this in production
        // res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
       return res.cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          domain: '.kabadiwala.onrender.com',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

      // return res.status(200).json('password updated successfully');

    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal server error')
    }
}

// updating user contacts
export const updateContact = async (req, res) => {
  try {
    //✅ Ensure OTP was verified
    if (!req.otpVerified) {
      return res.status(401).json({ message: 'OTP not verified. Access denied.' });
    }
    const userId = req.user;
    const { oldContact, newContact } = req.body;

    if (!oldContact || !newContact) {
      return res.status(400).json({ message: 'Please provide old and new contacts' });
    }
    
    const currentUser = await users.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if(newContact === currentUser?.phone || oldContact === newContact){
      return res.status(400).json({ message: 'Current & new Contact are same' });
    }

    if (currentUser.phone !== oldContact) {
      return res.status(400).json({ message: 'Old contact does not match' });
    }

    const existingUser = await users.findOne({ phone: newContact });
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
