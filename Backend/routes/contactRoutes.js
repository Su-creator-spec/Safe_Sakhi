const router = require("express").Router();
const { addContact, getContacts } = require("../controllers/contactController");

router.post("/add", addContact);
router.get("/:userId", getContacts);

module.exports = router;