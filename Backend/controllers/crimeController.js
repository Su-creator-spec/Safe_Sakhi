const { getData } = require("../utils/csvLoader");

// GET all zones
const getCrimeZones = (req, res) => {
  const data = getData();
  res.json(data);
};

// GET city by name
const getCityData = (req, res) => {
  const cityName = req.params.city.toLowerCase();
  const data = getData();

  const city = data.find(
    (c) => c.City.toLowerCase() === cityName
  );

  if (!city) {
    return res.status(404).json({ message: "City not found" });
  }

  res.json(city);
};

module.exports = { getCrimeZones, getCityData };