import express from "express";
import db from "../db/connection.mjs";
import mongodb from "mongodb";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.mjs";

const router = express.Router();
//POST-> contest/register
//This router will be activated when someone registers a new account
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await db.collection('Users').findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    let saltrounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltrounds);
    const newUser = {
      username,
      hashedPassword,
      email,
    };

    let collection = await db.collection("Users");
    let result = await collection.insertOne(newUser, (err, result) => {
      if (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Failed to register user" });
      } else {
        res.json({ message: "User registered successfully" });
      }
    });
    if (result.insertedId) {
      // Generate a JWT token for the new user
      generateToken(res, result.insertedId);
      res.status(201).json({
        _id: result.insertedId,
        username,
        email,
      });
    } else {
      res.status(400);
      throw new Error('Failed to create user');
    }
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Failed to register user' });
  } 
});
export default router;