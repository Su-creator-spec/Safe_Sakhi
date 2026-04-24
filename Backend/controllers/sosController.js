const Contact = require("../models/Contact");
const SOSLog = require("../models/SOSLog");
const sendSMS = require("../utils/sendAlert");

const triggerSOS = async (req, res) => {
  const { userId, location } = req.body;

  const contacts = await Contact.find({ userId });

  const message = `🚨 EMERGENCY! I need help. My location: ${location}`;

  for (let contact of contacts) {
    await sendSMS(contact.phone, message);
  }

  await SOSLog.create({ userId, location });

  res.json({ msg: "SOS Alert Sent!" });
};

module.exports = { triggerSOS };