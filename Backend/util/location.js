const API_KEY = "AIzaSyBg5Go5qG_VcM0RCf1N9NRPOaxkwZVykMg";
const axios = require("axios");
const HttpError = require("../models/http-error");

async function getCoordinates(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    throw new HttpError("Not a valid location bruv", 404);
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordinates;
