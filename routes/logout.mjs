import express from "express";

const router = express.Router();

router.post("/", (req, res) => {

    res.clearCookie("jwt"); // Clear the JWT token cookie
  
    res.status(200).json({ message: "Logged out successfully" });
  });
  export default router