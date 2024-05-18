import express from "express";
import axios from "axios";
import { globaldata } from "../query.js";
import { getGlobalData } from "../api.js";

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  // Handle login logic here
  const loginDetails = req.body;
  const response = await getGlobalData(loginDetails).catch((err) => {
    return res.status(400).send(err);
  });

  if (response.data.userStatus.username.length === 0) {
    res.cookie("csrftoken", `${loginDetails.csrf}`, {
      sameSite: "None",
      secure: true,
      maxAge: 1,
    });
    res.cookie("LEETCODE_SESSION", `${loginDetails.LEETCODE_SESSION}`, {
      sameSite: "None",
      secure: true,
      maxAge: 1,
    });
    return res.status(400).send("Invalid Credentials");
  }
  res.cookie("csrftoken", `${loginDetails.csrf}`, {
    sameSite: "None",
    secure: true,
    maxAge: 1000000,
    domain: ".vercel.app",
  });
  res.cookie("LEETCODE_SESSION", `${loginDetails.LEETCODE_SESSION}`, {
    sameSite: "None",
    secure: true,
    maxAge: 1000000,
    domain: ".vercel.app",
  });
  return res.status(200).send(response.data);
});

export default loginRouter;
