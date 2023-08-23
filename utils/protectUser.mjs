import jwt from "jsonwebtoken";
import db from "../db/connection.mjs";
import dotenv from "dotenv";
import mongodb from "mongodb";
import path from "path";
dotenv.config({ path: path.resolve(".env") });
export default async function protectUser(req, res, next) {
  try {
      let token;
      token = req.cookies.jwt;
      if (!token) {
          throw new Error("Not authorized, token failed");
      }

      // Verify the JWT token using the JWT_SECRET
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Find the user in the 'users' collection based on the decoded userId from the JWT
      const user = await db.collection("Users").findOne(
          { _id: new mongodb.ObjectId(decoded.userID) },
          { projection: { password: 0 } } // Excluding the 'password' field from the result
      );

      if (!user) {
          throw new Error("Not authorized, token failed");
      }

      req.user = user;
      next();
  } catch (error) {
      console.log(error);
      res.status(401).json({ error: "Unauthorized" });
  }
}

