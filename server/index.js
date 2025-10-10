const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const compression = require("compression");
require("dotenv").config();
const http = require("http");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);

// ✅ Initialize Socket.IO properly
const io = initSocket(server);

// ✅ Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(compression());

app.use(
  cors({
    origin: process.env.Base_URL,
    credentials: true,
  })
);

const leaveRouter = require("./Routes/leaveRouter");
const depRouter = require("./Routes/depRouter");
const projectRouter = require("./Routes/projectRouter");
const employeeRouter = require("./Routes/employeeRouter");
const salaryRouter = require("./Routes/salaryRoute");
const userRouter = require("./Routes/userRouter");
const attendanceRouter = require("./Routes/attendanceRouter");
const annoucementRouter = require("./Routes/annoucementRouter");

app.use("/api/department", depRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/user", userRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/projects", projectRouter);
app.use("/api/annoucement", annoucementRouter);

app.get("/", (req, res) => res.send("EMS Server is running 🚀"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(process.env.PORT || 5001, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5001}`);
    });
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));
