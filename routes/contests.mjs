import express from "express";
import db from "../db/connection.mjs";
import mongodb from "mongodb";
import protectUser from "../utils/protectUser.mjs";
import  multer from "multer";
import path from "path";

// Define storage settings for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/pending"); // Destination folder for saving images
  },
  filename: function (req, file, cb) {
    const contestId = req.params.contestid;
    const uniqueFilename = `${contestId}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename); // Use the unique filename for saving
  },
});

const upload = multer({ storage });
const router = express.Router();










router.get("/:contestid", protectUser, async (req, res) => {
  const contestId = req.params.contestid;

  try {
    const collection = db.collection("contests");
    const contest = await collection.findOne({
      _id: new mongodb.ObjectId(contestId),
    });

    if (!contest) {
      res.status(404).json({ error: "Contest not found" });
      return;
    }

    // You can customize the response structure as needed
    res.json(contest);
  } catch (err) {
    console.error("Error fetching contest details:", err);
    res.status(500).json({ error: "Failed to fetch contest details" });
  }
})
//POST-> contest/:contestid/rate
//This router will be activated when someone rates an image in a contest
router.post("/:contestid/rate", protectUser, async (req, res) => {
  const contestId = req.params.contestid;
  const user = req.user._id;
  const imagePath = req.body.path;
  const rating = req.body.rating; // Assuming the rating is sent in the request body

  try {
    const collection = db.collection("contests");
    const contest = await collection.findOne({
      _id: new mongodb.ObjectId(contestId),
    });

    if (!contest) {
      res.status(404);
      throw new Error("Contest not found");
    }
    //check if user is a participant
    const isParticipant = await contest.participants.some(
      (participant) => participant.toString() === user.toString()
    );
    if (!isParticipant) {
      res.status(403);
      throw new Error("You are not a participant of this contest");
    }
    // Find the permitted image with the specified path
    const imageToRateIndex = contest.permittedImages.findIndex(
      (img) => img.filename === imagePath
    );

    if (imageToRateIndex === -1) {
      res.status(404);
      throw new Error("Image not found in permittedImages");
    }
    // Initialize the 'ratings' array if it doesn't exist for the permitted image
    if (!contest.permittedImages[imageToRateIndex].ratings) {
      contest.permittedImages[imageToRateIndex].ratings = [];
    }
    // Check if the user has already rated the image
    const userAlreadyRated = contest.permittedImages[
      imageToRateIndex
    ].ratings.some((r) => r.rater.toString() === user.toString());

    if (userAlreadyRated) {
      res.status(403);
      throw new Error("You have already rated this image");
    }

    // Add the new rating and user ID to the permitted image
    const newRating = { rater: user, rating: rating };
    contest.permittedImages[imageToRateIndex].ratings.push(newRating);

    // Update the contest document in the database with the new rating and user ID
    await collection.updateOne(
      { _id: new mongodb.ObjectId(contestId) },
      { $set: { permittedImages: contest.permittedImages } }
    );

    res.json({ message: "Rating added to the image successfully" });
  } catch (error) {
    console.error("Error updating contest:", error);
    res.status(500).json({ error:error.message });
  }
});

//POST-> contest/:contestid/participate
//This router will be activated when someone participates in a contest
router.post( "/:contestid/participate", protectUser, async (req, res) => {
    try {
      const contestId = req.params.contestid;
      const user = req.user._id.toString(); // Convert user ID to string
      const collection = db.collection("contests");
      const contest = await collection.findOne({
        _id: new mongodb.ObjectId(contestId),
      });

      if (!contest) {
        throw new Error("Contest Not Found");
      }
      if (contest.creatorId.toString() === user) {
        throw new Error("Can not participate in your own contest");
      }
      const userPayment = contest.payments.some(
        (payment) => payment.toString() === user
      );

      if (!userPayment) {
        throw new Error("Can not participate without fee");
      }
      const userAlreadyParticipated = contest.participants.some(
        (participant) => participant.toString() === user
      );

      if (userAlreadyParticipated) {
        throw new Error("You are already a participant");
      }



      const result = await collection.updateOne(
        { _id: new mongodb.ObjectId(contestId) },
        { $push: { participants: new mongodb.ObjectId(user) } }
      );

      if (result.modifiedCount === 1) {
        res.json({ message: "Participant added to the contest successfully" });
      } else {
        throw new Error("Error adding participant");
      }
    } catch (error) {
      console.log(error);

      if (error.message === "Contest Not Found") {
        res.status(404).json({ error: error.message });
      } else if (
        error.message === "Can not participate in your own contest" ||
        error.message === "You are already a participant" ||
        error.message === "Can not participate without fee"
      ) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
);


//POST-> contest/:contestid/uploadimage
//This router will be activated when someone uploads an image to a contest
router.post("/:contestid/uploadimage", protectUser, upload.single("image"), async (req, res) => {
  const contestId = req.params.contestid;
  const userId = req.user._id;

  try {
    const usersCollection = db.collection("Users"); 
    const user = await usersCollection.findOne({ _id: new mongodb.ObjectId(userId) });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const collection = db.collection("contests");

    // Check if the contest exists
    const contest = await collection.findOne({
      _id: new mongodb.ObjectId(contestId),
    });

    if (!contest) {
      res.status(404);
      throw new Error("Contest not found");
    }

    // Check if the user is a participant
    const isParticipant = contest.participants.some(
      (participant) => participant.toString() === userId.toString()
    );

    if (!isParticipant) {
      res.status(403);
      throw new Error("You are not a participant of this contest");
    }

    // Add the image filename and associated participant ID to the "pendingImages" array
    const result = await collection.updateOne(
      { _id: new mongodb.ObjectId(contestId) },
      {
        $push: {
          pendingImages: {
            filename: req.file.filename, // Use the unique filename generated by multer
            participantId: new mongodb.ObjectId(userId),
            username: user.username
          },
        },
      }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: "Image added to the contest successfully" });
    } else {
      res.status(404);
      throw new Error("Contest not found or image not added");
    }
  } catch (err) {
    console.error("Error saving image filename to the database:", err);
    res.status(500).json({ error: "Failed to add image to the contest" });
  }
});

//PUT-> contest/:contestid/allowimage
//This router will be activated when contest creator allows an image
router.put("/:contestid/allowimage", protectUser, async (req, res) => {
  const contestId = req.params.contestid;
  const imagePath = req.body.filename;
  console.log(imagePath)
  // got from protectUser
  const user = req.user;

  try {
    // Fetch the contest from the 'contests' collection
    const collection = db.collection("contests");
    const contest = await collection.findOne({
      _id: new mongodb.ObjectId(contestId),
    });

    if (!contest) {
      throw new Error("Contest not found");
    }
    // console.log(contest.creatorId);
    // console.log(user._id);

    // Check if the user (editor) is the creator of the contest
    //Conversion to string is necessary
    if (contest.creatorId.toString() !== user._id.toString()) {
      throw new Error(
        "You are not authorized to allow images for this contest"
      );
    }
    // Find the image in the "pendingImages" array
    const imageToAllow = contest.pendingImages.find(
      (img) => img.filename === imagePath
    );

    if (!imageToAllow) {
      res.status(404);
      throw new Error("Image not found in pendingImages");
    }

    // If the user is the creator, update the contest to allow the image
    const result = await collection.updateOne(
      { _id: new mongodb.ObjectId(contestId) },
      {
        $pull: { pendingImages: { filename: imagePath } },
        $push: { permittedImages: imageToAllow },
      }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: "Image added to the contest successfully" });
    } else {
      res.status(500);
      throw new Error("Failed to add image to the contest");
    }
  } catch (error) {
    console.error("Error updating contest:", error);
    res.status(500).json({ error: "Failed to add image to the contest" });
  }
});



//POST-> contest/create
//This router will be activated when contest creator create a contest
//**** */
router.post("/create", protectUser, async (req, res) => {
  try {
    const creatorId = req.user._id; // got from protectUser middleware
    let newContest = {
      title: req.body.title,
      category: req.body.category,
      duration: req.body.duration,
      fee: req.body.fee,
      creatorId,
      pendingImages: [], // Initialize with an empty array
      permittedImages: [], // Initialize with an empty array
      participants: [], // Initialize with an empty array
      payments: [], // Initialize with an empty array
    };

    let collection = await db.collection("contests");
    let result = await collection.insertOne(newContest);
    res.send(result).status(200);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while creating the contest.");
  }
});


//GET-> contest
//This router will be activated when all contests should be listed
//**** */
router.get("/", async (req, res) => {
  let collection = await db.collection("contests");
  let result = await collection.find().toArray();
  console.log(result);
  res.json(result);
});
export default router;
