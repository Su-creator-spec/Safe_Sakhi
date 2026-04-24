try {
  require("dotenv").config();
} catch (e) {
  const fs = require("fs");
  if (fs.existsSync(".env")) {
    fs.readFileSync(".env", "utf8").split("\n").forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) process.env[match[1]] = match[2].trim();
    });
  }
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const sosRoutes = require("./routes/sosRoutes");
const crimeRoutes = require("./routes/crimeRoutes");

const { loadCSV } = require("./utils/csvLoader");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "your_mongodb_url")
  .then(() => console.log("DB Connected"))
  .catch(err => console.error("DB Connection Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api", crimeRoutes);

const PORT = process.env.PORT || 5000;
loadCSV().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error("CSV Load Error:", err);
  app.listen(PORT, () => console.log(`Server running on port ${PORT} (without CSV)`));
});