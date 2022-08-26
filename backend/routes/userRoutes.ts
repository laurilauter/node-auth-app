import express from "express";
const userRouter = express.Router();
import * as userController from "../controllers/userController";

//API routes
//get all users
userRouter.get("/users", userController.getUsers);

// //get a single user by id
userRouter.get("/user/:id", userController.getUser);

// //register a new user
userRouter.post("/register", userController.registerUser);

// //verify by email
userRouter.get("/verify/:id", userController.verifyUser);

// //user login
userRouter.post("/login", userController.loginUser);

// //edit user
userRouter.put("/edit/:id", userController.editUser);

// //delete user
userRouter.delete("/delete:id", userController.deleteUser);

//module.exports = userRouter;

export default userRouter;
