const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const connectDB = require("./Config/connectDB");
const userRoutes = require("./routes/AllRoutes");
const app = express();
const port = 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
