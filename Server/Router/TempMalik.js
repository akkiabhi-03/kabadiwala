import express from 'express';
import { auth ,malikAuth } from '../Authentication/UserAuth.js'
import VerifyToken from '../Authentication/OtpVerify.js';
import { getMalik, malikLogout, malikSignUp, tempMalikChangePassword, tempMalikForgotPassword, tempMalikLogin, updateMalikContact } from '../Controler/TempMalik.js';
import { AdminEditBook, orderByAdmin } from '../Controler/AdminOrder.js';

const router = express.Router();

//create new user 
router.post(`/signup`, VerifyToken , malikSignUp);

//user login 
router.post(`/login`,tempMalikLogin);

//user logout
router.post(`/logout`, malikAuth , malikLogout);

//profile data retriving 
router.get(`/details`, malikAuth , getMalik);

//changing password
router.patch(`/changepassword`, malikAuth ,tempMalikChangePassword);

//reset password 
router.post(`/forgotpassword` ,VerifyToken , tempMalikForgotPassword);

//contact update
router.patch(`/update-contact`, malikAuth , VerifyToken , updateMalikContact );

//admin books order for user 
router.post(`/admin-order`, malikAuth , orderByAdmin);

//Admin edit order of an user 
router.patch(`/admin-orderUpdate`, malikAuth , AdminEditBook);


export default router;