const express = require("express");

const app = express();

// Express body parser
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("dashboard");
});

app.listen(3005, () => {
  console.log("Server is running on PORT 3005");
});

const expressLayouts = require("express-ejs-layouts");

app.use(expressLayouts);
app.set("view engine", "ejs");