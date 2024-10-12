const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const port = 5000;
const app = express();
const router = require("./Routes/authRouter");
const depRouter = require("./Routes/depRouter");
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);
app.use("/api/department", depRouter);
app.use("/api/auth", router);
//  mongoose.connect(
//   "mongodb+srv://safara:safara@cluster0.t9lecvs.mongodb.net/EMS?retryWrites=true&w=majority&appName=Cluster0"
// );
const url =
  "mongodb+srv://safara:safara@cluster0.t9lecvs.mongodb.net/EMS?retryWrites=true&w=majority&appName=Cluster0";

app.get("/", async (req, res) => {
  res.send("server is fine ems");
});

mongoose
  .connect(url)
  .then(() => {
    // listen for request
    console.log("Successfully Connected to DB");
    app.listen(5000, () => {
      console.log(`running server ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
