import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const port = process.env.PORT;
//const uri = process.env.MONGO_URI; //for live DB
//const localUri = process.env.MONGO_LOCAL_URI; //for local DB
let environment = process.env.NODE_ENV || "development";
let uri;
if (environment == "production") {
  uri = process.env.MONGO_URI;
} else if (environment == "development") {
  uri = process.env.MONGO_URI_DEV;
}

//Connect to MongoDB database
export const getConnection = mongoose.connect(`${uri}`).then(() => {
  console.log("connected to database");

  //set up a server
  const app = express();
  app.use(express.json());
  app.use("/api", userRoutes);

  //serving public files
  //app.use("/", express.static(path.join(__dirname, "../public")));

  //serv static FE
  // app.get("/", (req: any, res: any) => {
  //   res.sendFile(path.join(__dirname, "../public/index.html"));
  // });

  app.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
  });
});
