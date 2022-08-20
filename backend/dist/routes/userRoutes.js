"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userModel_1 = require("../models/userModel");
require("dotenv/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const router = express_1.default.Router();
//API routes
//get all Users
router.get("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUsers = yield userModel_1.User.find();
        res.status(200).send(getUsers);
    }
    catch (_a) {
        res.status(404).send({ error: "No users found" });
    }
}));
//register a new user
router.post("/register", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("req.body", req.body);
        const createUser = new userModel_1.User({
            email: req.body.email,
            password: req.body.password,
        });
        try {
            // if (req.body.password) {
            //   req.body.password = bcrypt.hashSync(req.body.password, 10);
            // }
            yield userModel_1.User.create(req.body);
            res.status(200).send(createUser);
        }
        catch (error) {
            console.error("Register endpoint failed");
            res.status(500).send({ status: "Register endpoint failed" });
        }
    });
});
//user login
router.post("/login", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.User.findOne({ email: req.body.email });
            if (user === null || user === void 0 ? void 0 : user.password) {
                const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
                if (isPasswordValid) {
                    const token = jwt.sign({ email: user.email }, secret, {
                        expiresIn: "1h",
                    });
                    res.status(200).send({ token: "Bearer " + token });
                }
                else {
                    throw "Wrong password";
                }
            }
            else {
                throw "User does not exist";
            }
        }
        catch (error) {
            res.status(401).send({ status: "Login error" });
        }
    });
});
//create new User
// router.post("/user", async (req: express.Request, res: express.Response) => {
//   const createUser = new User({
//     email: req.body.email,
//     password: req.body.password,
//   });
//   try {
//     await User.create(req.body);
//     res.status(200).send(createUser);
//   } catch {
//     res.status(404).send({ error: "Unable to create user" });
//   }
// });
//get User by id
router.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield userModel_1.User.findOne({ _id: req.params.id });
        res.status(200).send(getUser);
    }
    catch (_b) {
        res.status(404).send({ error: "User doesn't exist!" });
    }
}));
//edit User
router.put("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req body ", req.body);
    try {
        const editUser = yield userModel_1.User.findOne({ _id: req.params.id });
        if (req.body.email) {
            editUser.email = req.body.email;
        }
        if (req.body.password) {
            editUser.password = req.body.password;
        }
        const savedUser = yield editUser.save();
        console.log("saved User in DB ", savedUser);
        res.status(200).send(savedUser);
    }
    catch (_c) {
        res.status(404).send({ error: "Unable to edit user" });
    }
}));
//delete User
router.delete("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userModel_1.User.findOneAndRemove({ _id: req.params.id });
        res.status(200).send("User removed");
    }
    catch (_d) {
        res.status(404).send({ error: "Unable to delete user" });
    }
}));
module.exports = router;
