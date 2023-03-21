const { v4: uuidv4 } = require("uuid");
const expressValidator = require("express-validator");
const User = require("../models/user");
const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Divyansh Vermaz",
    email: "test@test.com",
    password: "testers",
  },
];

const getUsers = async (req, res, next) => {
  let totalUsers;

  try {
    totalUsers = await User.find({}, "-password");
  } catch (err) {
    console.log(err);
    return next(new HttpError("something went wrong try again later", 404));
  }

  console.log(totalUsers);

  res.json({
    totalUsers: totalUsers.map((u) => u.toObject({ getters: true })),
  });
};

const signup = async (req, res, next) => {
  console.log(req.body);
  const error = expressValidator.validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return next(new HttpError("bad credentials bruv", 442));
  }

  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("something went wrong please try again later"),
      500
    );
  }
  if (existingUser) {
    return next(
      new HttpError("User already exists Please login instead!!"),
      422
    );
  }

  const createdUser = new User({
    name,
    email,
    password,
    image: req.file.path,
    places: [],
  });

  try {
    await createdUser.save().then(() => {
      return createdUser;
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Siging-Up failed Try again later", 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const error = expressValidator.validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return next(new HttpError("wrong credentials bruv", 444));
  }
  const { email, password } = req.body;

  let identifiedUser;

  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Something went wrong try again later", 404));
  }

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError("No user found", 404));
  }

  res.json({
    message: "Logged in!",
    user: identifiedUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
