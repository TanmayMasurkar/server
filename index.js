import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from 'mongoose';

import userRouter from "./router/user.router";
import singleScreenRouter from "./router/singleScreen.router";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json()); //for body data
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log("Your server running on http://localhost:" + PORT);
});


mongoose
  .connect(process.env.MGDB_CONT+process.env.DB_NAME)
  .then(() => {
    console.log("mongodb started");
  })
  .catch(() => {
    console.log("mongodb connection error");
});

app.use("/user", userRouter);
app.use("/singleScreen",singleScreenRouter)