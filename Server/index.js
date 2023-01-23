import express from "express";
import mongoose from "mongoose";
import * as Validations from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import handleErrors from "./handleErrors.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import multer from "multer";
import cors from 'cors'
const app = express();
const storage = multer.diskStorage({
  destination: ($, _, cb) => {
    cb(null, "uploads");
  },
  filename: (_, filename, cb) => {
    cb(null, filename.originalname);
  },
});

const upload = multer({ storage });
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors())

mongoose
  .connect(
    "mongodb+srv://admin:root@cluster0.bu48yln.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB started...");
  })
  .catch((err) => {
    console.log(err);
  });

//Routes

app.post("/auth/register", Validations.registerValidation , handleErrors, UserController.register);

app.post("/auth/login", Validations.loginValidation, handleErrors, UserController.login);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/posts", checkAuth, Validations.postCreateValidation, handleErrors, PostController.create);

app.get("/posts/:id", checkAuth, PostController.getOne);

app.get("/posts", PostController.getAll);

app.patch("/posts/:id", checkAuth, handleErrors, PostController.updatePost);

app.delete("/posts/:id", checkAuth, PostController.removePost);

app.listen(5555, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server started on port 5555");
});
