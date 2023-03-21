const express = require("express");
const bodyParser = require("body-parser");
const placeRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const mongoose = require("mongoose");
const path = require("path");

const fs = require("fs");
const HttpError = require("./models/http-error");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  throw new HttpError("Page not found", 404);
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://mernproject:mern1234@cluster0.bsuoxbe.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(4000, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Listening...");
    });
  })
  .catch((err) => {
    console.log(err);
  });
