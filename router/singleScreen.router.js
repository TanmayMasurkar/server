import express from "express";
import { addData, deleteSingleScreen, secureSingleScreen, getUserData, getSingleScreen, closeSingleScreen } from "../controller/sinScreen.controller";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/create" ,authenticate, addData)
router.get("/user/:userId",authenticate,getUserData)
router.post("/securescreen",secureSingleScreen)
router.post("/screen",getSingleScreen)
router.post("/close",closeSingleScreen)
// router.delete("/delete/:id" , deleteSingleScreen)

export default router;