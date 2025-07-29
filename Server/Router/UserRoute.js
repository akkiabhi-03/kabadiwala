// routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import { changePassword, forgotPassword, getCurrentUser, login, logout, signUp, updateContact, updateUser } from '../Controler/userControler.js'
import VerifyToken from '../Authentication/OtpVerify.js';
import { auth } from '../Authentication/UserAuth.js';


// dotenv.config();

const router = express.Router();
// const base = process.env.FRONTEND_URL;
// const upload = multer({ dest: 'uploads/' });

//profile pic update 
// router.post(`update-profilepic`, auth, upload.fields([{ name: 'profilePic', maxCount: 1 },]), uploadMedia);

//create new user 
router.post(`/signUp`, VerifyToken , signUp);

//user login 
router.post(`/login`, login);

//user logout
router.post(`/logout`, auth , logout);

//profile data retriving 
router.get(`/profile`, auth , getCurrentUser);

//profile update (name & address)
router.patch(`/update-profile`, auth , updateUser);

//changing password
router.patch(`/changepassword`, auth ,changePassword);

//reset password 
router.post(`/forgotpassword` ,VerifyToken , forgotPassword);

//contact update
router.patch(`/update-contact`, auth , VerifyToken , updateContact );


export default router;