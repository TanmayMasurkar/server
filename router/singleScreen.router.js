import express from "express";
import { addData } from "../controller/sinScreen.controller";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/create" ,authenticate, addData)

export default router;