import SSLCommerzPayment from  'sslcommerz-lts';
import db from  '../db/connection.mjs';
import protectUser from '../utils/protectUser.mjs';
import dotenv from 'dotenv';
import mongodb from 'mongodb';
import express from 'express';
import path from "path";
dotenv.config({path: path.resolve('.env') });

const router  = express.Router();
const store_id =  process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = false //true for live, false for sandbox
//Initialize payment GET-> /payment/:contestid
router.get('/:contestid', protectUser, async (req, res) => {
    try {
        const userId = req.user._id;
        const contestId = req.params.contestid;
        const collection = db.collection("contests");
        const contest = await collection.findOne({
            _id: new mongodb.ObjectId(contestId)
        });

        if (!contest) {
            throw new Error("Contest not found");
        }

        const userPayment = contest.payments.some(payment => payment.toString() === userId.toString());

        if (userPayment) {
            throw new Error("You have already paid for this contest.");
        }

        const fee = parseInt(contest.fee);
        const transActionId = new mongodb.ObjectId().toString();
        const data = {
            total_amount: fee,
            currency: 'BDT',
            tran_id: transActionId , // use unique tran_id for each api call
            success_url: `http://localhost:5000/payment/validate/${contestId}/${userId}`,
            fail_url: 'http://localhost:3030/fail',
            cancel_url: 'http://localhost:3030/cancel',
            ipn_url: 'http://localhost:5000/payment/validate-ipn',
            shipping_method: 'Courier',
            product_name: 'Computer.',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: 'Customer Name',
            cus_email: 'customer@example.com',
            cus_add1: 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(data);
       // console.log(apiResponse);
        let GatewayPageURL = apiResponse.GatewayPageURL;
        res.json({ GatewayPageURL, "message":"Initializing payment"});
        console.log('Redirecting to: ', GatewayPageURL);
    } catch (error) {
        console.log(error);
        if (error.message === "Contest not found") {
            res.status(404).json({ error: error.message });
        } else if (error.message === "You already paid for this contest.") {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});



//Successfull payment POST-> /payment/validate/:contestid/:userid
router.post('/validate/:contestid/:userid',async (req, res)=>{
    const contestId = req.params.contestid;
    const userId = req.params.userid;
    const collection = await db.collection("contests");
    const contest = await collection.findOne(
        {_id: new mongodb.ObjectId(contestId)}
    )
    if (!contest.payments) {
        contest.payments = [];
    }
    const result = await collection.updateOne(
        { _id: new mongodb.ObjectId(contestId) },
        { $push: { payments: userId } }
      );
      if (result.modifiedCount === 1) {
        res.json({ message: "Payment recorded" });
      } else {
        res
          .status(404)
          .json({ error: "Payment error" });
      }
});




export default router;