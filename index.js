const express = require("express");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/users");

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Server started at localhost:${PORT}`);
});
