import express from "express";
import { User } from "../models/userModel";
import "dotenv/config";

import bcrypt from "bcrypt";
//const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";
//const jwt = require("jsonwebtoken");
import { body, validationResult } from "express-validator";
const secret = process.env.SECRET;
const router = express.Router();

//API routes
//get all users
router.get("/users", async (req: express.Request, res: express.Response) => {
  try {
    const getUsers = await User.find();
    res.status(200).send(getUsers);
  } catch {
    res.status(404).send({ error: "No users found" });
  }
});

//register a new user
router.post(
  "/register",
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  async function (req: express.Request, res: express.Response) {
    //1. validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let error = "Unknown error";
    try {
      //2. check if user exists
      const getUser = await User.findOne({ email: req.body.email });
      if (getUser) {
        error = `${req.body.email} already exists`;
        //route to login or reset password
      }
      //3. register the user
      const passwordHashed = bcrypt.hashSync(req.body.password, 10);
      let createUser = new User({
        email: req.body.email,
        password: passwordHashed,
      });
      await User.create(createUser);
      //send validation email
      res.status(200).send(createUser);
    } catch (error) {
      res
        .status(500)
        .send({ status: "User registration failed", error: error });
    }
  }
);

//user login
router.post(
  "/login",
  async function (req: express.Request, res: express.Response) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user?.password) {
        const isPasswordValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (isPasswordValid) {
          const token = jwt.sign({ email: user.email }, secret!, {
            expiresIn: "1h",
          });
          res.status(200).send({ token: "Bearer " + token });
        } else {
          throw "Wrong password";
        }
      } else {
        throw "User does not exist";
      }
    } catch (error) {
      res.status(401).send({ status: "Login error" });
    }
  }
);

//get a single user by id
router.get("/user/:id", async (req: express.Request, res: express.Response) => {
  try {
    const getUser = await User.findOne({ _id: req.params.id });
    res.status(200).send(getUser);
  } catch {
    res.status(404).send({ error: "User doesn't exist!" });
  }
});

//edit user
router.put("/user/:id", async (req: express.Request, res: express.Response) => {
  try {
    const editUser = await User.findOne({ _id: req.params.id });
    if (req.body.email) {
      editUser!.email = req.body.email;
    }
    if (req.body.password) {
      editUser!.password = req.body.password;
    }
    const savedUser = await editUser!.save();
    res.status(200).send(savedUser);
  } catch {
    res.status(404).send({ error: "Unable to edit user" });
  }
});

//delete user
router.delete(
  "/user/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      await User.findOneAndRemove({ _id: req.params.id });
      res.status(200).send("User removed");
    } catch {
      res.status(404).send({ error: "Unable to delete user" });
    }
  }
);

module.exports = router;
