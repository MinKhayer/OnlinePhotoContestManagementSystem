import express from "express";
import db from "../db/connection.mjs";
import mongodb from "mongodb";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.mjs";

const router = express.Router();
//POST-> contest/login
//This router will be activated when someone logs into a  account
router.post('/', async (req, res, next) => {
  const { email, password } = req.body;
    // Find the user in the 'users' collection based on the email
    const user = await db.collection("Users").findOne({ email });

    if (user && (await bcrypt.compare(password, user.hashedPassword))) {
      // Generate a JWT token for the authenticated user
      generateToken(res, user._id);
      console.log("Login Successful")
      res.status(200).json({message: "Login Successful"});
    } else {

      next(new Error("Invalid email or password"))
      return
    }
});
export default router;