"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
const userController = __importStar(require("../controllers/userController"));
//API routes
//get all users
userRouter.get("/", userController.getUsers);
// userRouter.get(
//   "/users",
//   async (req: express.Request, res: express.Response) => {
//     try {
//       const getUsers = await User.find();
//       res.status(200).send(getUsers);
//     } catch {
//       res.status(404).send({ error: "No users found" });
//     }
//   }
// );
// //get a single user by id
userRouter.get("/", userController.getUser);
// userRouter.get(
//   "/user/:id",
//   async (req: express.Request, res: express.Response) => {
//     try {
//       const getUser = await User.findOne({ _id: req.params.id });
//       res.status(200).send(getUser);
//     } catch {
//       res.status(404).send({ error: "User doesn't exist!" });
//     }
//   }
// );
// //register a new user
userRouter.post("/", userController.registerUser);
// userRouter.post(
//   "/register",
//   body("email").isEmail().normalizeEmail(),
//   body("password").isLength({ min: 8 }),
//   async function (req: express.Request, res: express.Response) {
//     //1. validate the request
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     let error = "Unknown error";
//     try {
//       //2. check if user exists
//       const getUser = await User.findOne({ email: req.body.email });
//       if (getUser) {
//         error = `${req.body.email} already exists`;
//         //route to login or reset password
//       }
//       //3. register user
//       const passwordHashed = bcrypt.hashSync(req.body.password, 10);
//       let createUser = new User({
//         email: req.body.email,
//         password: passwordHashed,
//         isVerified: false,
//       });
//       await User.create(createUser);
//       //send validation email
//       res.status(200).send(createUser);
//     } catch (error) {
//       res
//         .status(500)
//         .send({ status: "User registration failed", error: error });
//     }
//   }
// );
// //user login
userRouter.post("/api", userController.loginUser);
// userRouter.post(
//   "/login",
//   async function (req: express.Request, res: express.Response) {
//     try {
//       const user = await User.findOne({ email: req.body.email });
//       if (user?.password) {
//         const isPasswordValid = bcrypt.compareSync(
//           req.body.password,
//           user.password
//         );
//         if (isPasswordValid) {
//           const token = jwt.sign({ email: user.email }, secret!, {
//             expiresIn: "1h",
//           });
//           res.status(200).send({ token: "Bearer " + token });
//         } else {
//           throw "Wrong password";
//         }
//       } else {
//         throw "User does not exist";
//       }
//     } catch (error) {
//       res.status(401).send({ status: "Login error" });
//     }
//   }
// );
// //edit user
userRouter.put("/", userController.editUser);
// userRouter.put(
//   "/user/:id",
//   async (req: express.Request, res: express.Response) => {
//     try {
//       const editUser = await User.findOne({ _id: req.params.id });
//       if (req.body.email) {
//         editUser!.email = req.body.email;
//       }
//       if (req.body.password) {
//         editUser!.password = req.body.password;
//       }
//       if (req.body.isVerified) {
//         editUser!.isVerified = req.body.isVerified;
//       }
//       const savedUser = await editUser!.save();
//       res.status(200).send(savedUser);
//     } catch {
//       res.status(404).send({ error: "Unable to edit user" });
//     }
//   }
// );
// //delete user
userRouter.delete("/", userController.deleteUser);
// userRouter.delete(
//   "/user/:id",
//   async (req: express.Request, res: express.Response) => {
//     try {
//       await User.findOneAndRemove({ _id: req.params.id });
//       res.status(200).send("User removed");
//     } catch {
//       res.status(404).send({ error: "Unable to delete user" });
//     }
//   }
// );
exports.default = userRouter;
//module.exports = userRouter;
