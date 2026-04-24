const fs = require("fs");
const csv = require("csv-parser");

let crimeData = [];

const loadCSV = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream("data/city_safety_scores.csv")
      .pipe(csv())
      .on("data", (row) => {
        // Dynamically assign Green zone if Safe Score >= 38
        if (parseFloat(row["Safe Score"]) >= 38) {
          row["Safety Zone"] = "Green";
        }
        crimeData.push(row);
      })
      .on("end", () => {
        console.log("CSV Loaded Successfully");
        resolve(crimeData);
      })
      .on("error", reject);
  });
};

const getData = () => crimeData;

module.exports = { loadCSV, getData };