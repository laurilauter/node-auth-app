import { Request, Response } from "express";
import User from "../models/userModel";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
const secret = process.env.SECRET;
const emailSecretKey = process.env.EMAIL_SECRET_KEY;
import * as nodemailer from "nodemailer";
//const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "mail.lautrade.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//get all users
export async function getUsers(req: Request, res: Response) {
  try {
    const getUsers = await User.find();
    res.status(200).send(getUsers);
  } catch {
    res.status(404).send({ error: "No users found" });
  }
}

//register a new user
export async function registerUser(req: Request, res: Response) {
  //1. validate the request
  body("email").isEmail().normalizeEmail();
  body("password").isLength({ min: 8 });
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
    //3. register user
    const passwordHashed = bcrypt.hashSync(req.body.password, 10);
    let createUser = new User({
      email: req.body.email,
      password: passwordHashed,
    });

    await User.create(createUser);

    // Step 3 - Generate a verification token with the user's ID
    const verificationToken = createUser.generateVerificationToken();
    console.log("verificationToken ", verificationToken);
    //const verificationToken = "test";
    //send validation email
    const url = `http://localhost:${process.env.PORT}/api/verify/${verificationToken}`;
    console.log("url ", url);
    // transporter.sendMail({
    //   from: '"Lautrade system" <system@lautrade.com>', // sender address
    //   to: req.body.email,
    //   subject: "Verify Account testing 2",
    //   text: "Verify Account testing email 2.", // plain text body
    //   html: `Click <a href = '${url}'>here</a> to confirm your email 2.`,
    // });

    res.status(200).send(createUser);
  } catch (error) {
    res.status(500).send({ status: "User registration failed", error: error });
  }
}

//user login
export async function loginUser(req: Request, res: Response) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user?.password) {
      const isPasswordValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (isPasswordValid && user.verified) {
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

//get a single user by id
export async function getUser(req: Request, res: Response) {
  try {
    const getUser = await User.findOne({ _id: req.params.id });
    res.status(200).send(getUser);
  } catch {
    res.status(404).send({ error: "User doesn't exist" });
  }
}

//get a single user by id
export async function verifyUser(req: Request, res: Response) {
  try {
    const token = req.params.id;
    // Check we have an id
    if (!token) {
      return res.status(422).send({
        message: "Missing Token",
      });
    }
    // Step 1 -  Verify the token from the URL
    let payload: any = null;
    try {
      payload = jwt.verify(token, emailSecretKey!);
    } catch (err) {
      return res.status(500).send(err);
    }
    try {
      // Step 2 - Find user with matching ID
      const user = await User.findOne({ _id: payload.id }).exec();
      if (!user) {
        return res.status(404).send({
          message: "User does not exist",
        });
      }
      // Step 3 - Update user verification status to true
      user.verified = true;
      await user.save();
      return res.status(200).send({
        message: "Account Verified",
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  } catch {
    res.status(500).send({ error: "User verification failed" });
  }
}

//edit user
export async function editUser(req: Request, res: Response) {
  try {
    const editUser = await User.findOne({ _id: req.params.id });
    if (req.body.email) {
      editUser!.email = req.body.email;
    }
    if (req.body.password) {
      editUser!.password = req.body.password;
    }
    if (req.body.isVerified) {
      editUser!.verified = req.body.verified;
    }
    const savedUser = await editUser!.save();
    res.status(200).send(savedUser);
  } catch {
    res.status(404).send({ error: "Unable to edit user" });
  }
}

//delete user  //im plement soft delete here
export async function deleteUser(req: Request, res: Response) {
  try {
    await User.findOneAndRemove({ _id: req.params.id });
    res.status(200).send("User removed");
  } catch {
    res.status(404).send({ error: "Unable to delete user" });
  }
}
