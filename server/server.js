const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const documentRoutes = require("./routes/documentRoutes");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/documents", documentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
