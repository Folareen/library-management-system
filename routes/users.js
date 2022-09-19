const express = require("express");
const fs = require("fs");

const usersRouter = express.Router();

usersRouter.post("/register", (req, res) => {
  const { name, password } = req.body;
  let usersArr;

  if (!name) {
    return res.status(400).json({ message: "name cannot be empty!" });
  }
  if (!password) {
    return res.status(400).json({ message: "name cannot be empty!" });
  }

  try {
    usersArr = JSON.parse(fs.readFileSync("db/users.json", "utf8"));
  } catch (error) {
    console.log(error);
  }

  if (usersArr.find((user) => user.name === name)) {
    return res.status(400).json({ message: "User exists!" });
  }

  try {
    usersArr.push({ ...req.body, role: "visitor" });
    fs.writeFileSync("db/users.json", JSON.stringify(usersArr));
  } catch (err) {
    console.error(err);
  }

  return res.status(200).json({
    user: { ...req.body, role: "visitor" },
    message: "registration successful!",
  });
});

usersRouter.post("/login", (req, res) => {
  const { name, password } = req.body;
  let usersArr;

  if (!name) {
    return res.status(400).json({ message: "name cannot be empty!" });
  }
  if (!password) {
    return res.status(400).json({ message: "name cannot be empty!" });
  }

  try {
    usersArr = JSON.parse(fs.readFileSync("db/users.json", "utf8"));
  } catch (error) {
    console.log(error);
  }

  let userObj = usersArr.find((user) => user.name === name);

  if (!userObj) {
    return res.status(400).json({ message: "User do not exist!" });
  } else if (userObj.password !== password) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  return res.status(200).json({ message: "Login successful" });
});

// usersRouter.get("/", (req, res) => {
//   const { name, password } = req.body;
//   let users;
//   let usersArr;

//   try {
//     users = fs.readFileSync("db/users.json", "utf8");
//     usersArr = JSON.parse(users);
//   } catch (error) {
//     console.log(error);
//   }

//   let isUserAdmin = usersArr.find((user) => user.role === "admin");
//   console.log(isUserAdmin);
//   if (isUserAdmin) {
//     return res.status(200).json({ usersArr });
//   } else {
//     return res.status(401).json({ message: "unauthorized!" });
//   }
// });

module.exports = usersRouter;
