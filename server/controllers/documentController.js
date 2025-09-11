const { savePassport } = require("../models/passportModel");

const createPassport = async (req, res) => {
  try {
    const saved = await savePassport(req.body);
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = { createPassport };
