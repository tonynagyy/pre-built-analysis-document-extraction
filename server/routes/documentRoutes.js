const express = require("express");
const { createPassport } = require("../controllers/documentController");

const router = express.Router();

//Get all documents (for testing)
router.get("/", (req, res) => {
  res.send("Document API is running");
});

// POST /api/documents/passport
router.post("/passport", createPassport);

module.exports = router;
