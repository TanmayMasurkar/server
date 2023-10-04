import express from "express";
import { addData, deleteSingleScreen, getSingleScreen, getUserData } from "../controller/sinScreen.controller";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/create" ,authenticate, addData)
router.get("/user/:userId",authenticate,getUserData)
router.get("/screen",getSingleScreen)
// router.delete("/delete/:id" , deleteSingleScreen)

export default router;