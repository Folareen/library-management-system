const express = require("express");
const fs = require("fs");

const usersRouter = express.Router();

usersRouter.post("/", (req, res) => {
  const { name, password } = req.body;
  let users;
  let usersArr;

  if (!name) {
    return res.status(400).json({ message: "name cannot be empty!" });
  }
  if (!password) {
    return res.status(400).json({ message: "name cannot be empty!" });
  }

  try {
    users = fs.readFileSync("db/users.json", "utf8");
    usersArr = JSON.parse(users);
  } catch (error) {
    console.log(error);
  }

  const userExists = usersArr.find((user) => user.name === name);
  if (userExists) {
    return res.status(400).json({ message: "User exists!" });
  }

  try {
    usersArr.push({ ...req.body, role: "visitor" });
    fs.writeFileSync("db/users.json", JSON.stringify(usersArr));
  } catch (err) {
    console.error(err);
  }

  return res.status(200).json({ user: { ...req.body, role: "visitor" } });
});

module.exports = usersRouter;
