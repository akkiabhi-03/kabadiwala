import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { users } from '../Database/UserSchema.js';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import { tempMalik } from '../Database/TempSchema.js';

// auth middleware to verify JWT token and attach user to request object
export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log(token)
        if(!token){
            return res.status(401).json({message:"Unauthorized access"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(!decoded){
            return res.status(401).json({message:"Invalid Token"});
        }
        req.user = decoded.id
        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// generate JWT token for user for login/signup
export const generateToken = (userId) => {
    return jwt.sign({id:userId}, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d' // expiry time for the token
    });
}

// hash password using bcrypt
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// compare password with hashed password
export const comparePassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
}

//malik auth
export const malikAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
console.log(token)
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access (Admin)' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.tempMalik = decoded.id;
    next();
  } catch (err) {
    console.error('Admin Auth Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
