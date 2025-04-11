import express from "express"
import { addEvent, getlistEvent, getEventDetail, removeEvent, updateEvent } from "../controllers/eventController.js";
import { verifyAdmin } from "../middleware/auth.js";
import multer from "multer"

const eventRouter = express.Router();

// Lưu file tạm thời vào "temp_uploads"
const storage = multer.diskStorage({
    destination: "temp_uploads", 
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

eventRouter.post("/add", verifyAdmin, upload.single("image"),  addEvent);
eventRouter.get("/list", getlistEvent);
eventRouter.get("/:id", getEventDetail);
eventRouter.delete("/remove/:eventId", verifyAdmin, removeEvent);
eventRouter.put("/update/:eventId", verifyAdmin, upload.single("image"), updateEvent);


export default eventRouter;

