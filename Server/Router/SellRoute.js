import express from 'express';
import { auth ,malikAuth } from '../Authentication/UserAuth.js'
import { EditBook, getOrderDetails, orderBook, UpdateStatus } from '../Controler/SellControler.js'
import VerifyToken from '../Authentication/OtpVerify.js'
import { createAppData, deleteSoldOrders, getAllOrdersGrouped, getAppDataByArea, getPrice, priceUpdate, updateTotalPurchase } from '../Controler/StoreCenter.js';
const router = express.Router();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~ Order Route ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//book new order
router.post('/newOrder' , auth , orderBook );

//Edit current order (isSold also)
router.patch(`/editOrder`, auth , EditBook);

//get my all orders
router.get(`/getOrder`, auth , getOrderDetails );

//update status (~only by admin)
router.patch(`/status-update`, malikAuth , UpdateStatus);


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ app routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//updating price for each materials (~only by admin)
router.patch(`/price-update`, malikAuth , priceUpdate);

//total puchase updation whole sell
router.patch(`/update-totalPurchase`, malikAuth , updateTotalPurchase);

//retriving app-data
router.get(`/app-data`, malikAuth ,getAppDataByArea);

// create new center
router.post(`/create-appData` ,malikAuth , createAppData);

// for everyone get price for specific location
router.get(`/prices`, getPrice );

//getAllOrdersGrouped ( pending & perchased )
router.get(`/get-userOrder`, malikAuth , getAllOrdersGrouped );

// delete user's purchased order
router.delete(`/delete-userOrder`, malikAuth , deleteSoldOrders );


export default router;