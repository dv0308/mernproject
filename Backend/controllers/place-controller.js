const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const expressValidator = require("express-validator");
const location = require("../util/location");
const Place = require("../models/place");
const mongodb = require("mongodb");
const { mongoose } = require("mongoose");
const fs = require("fs");
const User = require("../models/user");

let DUMMY_PLACES = [
  {
    id: "u1",
    title: "taj mahal",
    description: "very nice sad for builders",
    coordinates: {
      lat: 40.1123,
      lng: -12.23423,
    },
    address: "agra",
    creator: "p1",
  },
];

const getPlaceById = async (req, res, next) => {
  const id = req.params.pid;

  let places;

  try {
    places = await Place.findById(id);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("something went wrong could not find the place", 500)
    );
  }

  if (!places) {
    return next(
      new HttpError("Could not find a place for the provided id", 404)
    );
  }
  res.json({ places: places.toObject({ getters: true }) });
};

const createPlace = async (req, res, next) => {
  const error = expressValidator.validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    next(new HttpError("error bruv", 401));
  }

  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await location(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    image: req.file.path,
    address,
    location: coordinates,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    console.log(err);
    return next(new HttpError("something went wrong cannot create place", 500));
  }

  if (!user) {
    return next(new HttpError("Cannot find user by this id", 400));
  }

  console.log(user);

  try {
    const session = await User.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session });
    user.places.push(createdPlace);
    await user.save({ session: session });
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
};

const updatePlace = async (req, res, next) => {
  const error = expressValidator.validationResult(req);

  if (!error.isEmpty()) {
    console.log(error);
    throw new HttpError("error bruv", 442);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let updatedPlace;

  try {
    updatedPlace = await Place.findById(placeId);
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("something went wrong bruv couldn't update the place"),
      500
    );
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("something wrong cannot save the updated the place"),
      500
    );
  }
  // DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  //   const placeIndex = DUMMY_PLACES.findIndex((p) => placeId === p.id);

  let toBeDeleted;
  let userId;

  try {
    toBeDeleted = await Place.findById(placeId).populate("creator");
    userId = toBeDeleted.creator;
  } catch (err) {
    console.log(err);
    return next(new HttpError("error!!!!!bzzz", 404));
  }

  const imagPath = toBeDeleted.image;
  try {
    const session = await Place.startSession();
    await session.startTransaction();
    console.log(userId._id);

    await User.updateOne({ _id: userId._id }, { $pull: { places: placeId } });
    await Place.deleteOne({ _id: placeId }).session(session);
    await toBeDeleted.save();
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.log(err);
    return next(new HttpError("error!!fnfdfs", 404));
  }

  fs.unlink(imagPath, (err) => {
    console.log(err);
  });
  res.status(200).json({ message: "deleted" });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  console.log(userId);
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        "something went wrong bruv could not find place by registered to that userID"
      ),
      500
    );
  }

  if (!places) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }

  res.json({
    place: places.map((p) => {
      return p.toObject({ getters: true });
    }),
  });
};

exports.getPlaceById = getPlaceById;
exports.createPlace = createPlace;
exports.getPlacesByUserId = getPlacesByUserId;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
