import { Request, Response } from "express";
import { User } from "../models/userModel";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
const secret = process.env.SECRET;

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
      isVerified: false,
    });
    await User.create(createUser);
    //send validation email
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

//get a single user by id
export async function getUser(req: Request, res: Response) {
  try {
    const getUser = await User.findOne({ _id: req.params.id });
    res.status(200).send(getUser);
  } catch {
    res.status(404).send({ error: "User doesn't exist!" });
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
      editUser!.isVerified = req.body.isVerified;
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
