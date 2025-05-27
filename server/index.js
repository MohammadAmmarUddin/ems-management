const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const port = 5001 || 5000;
const app = express();
const authRouter = require("./Routes/authRouter");
const leaveRouter = require("./Routes/leaveRouter");
const depRouter = require("./Routes/depRouter");
const employeeRouter = require("./Routes/employeeRouter");
app.use(express.json());
const baseUrl = process.env.Base_URL;
app.use(
  cors({
    origin: baseUrl,
  })
);
app.use("/api/department", depRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/auth", authRouter);
app.use("/api/leave", leaveRouter);
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
    app.listen(port, () => {
      console.log(`running server ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
