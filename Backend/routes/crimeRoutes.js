const express = require("express");
const router = express.Router();

const {
  getCrimeZones,
  getCityData,
} = require("../controllers/crimeController");

router.get("/crime-zones", getCrimeZones);
router.get("/crime-zones/:city", getCityData);

module.exports = router;