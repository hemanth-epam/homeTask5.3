const express = require("express");
const uuid = require("uuid");
const userSchema = require("./users.js").userSchema;
const router = express.Router();

const users = []; //for in-memory

//for validating according to created schema
const userValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error === null || error === void 0 ? void 0 : error.isJoi) {
      res.json(error.message);
    } else {
      next();
    }
  };
};

//get all users
router.get("/users", (req, res) => {
  const loginSubstring = "",
    limit = 10;
  const list = users
    .filter(
      (user) =>
        user.login.includes(loginSubstring.toString()) && !user.isDeleted
    ) //if user deleted dont display
    .sort((a, b) => a.login.localeCompare(b.login))
    .slice(0, Number(limit));
  res.send(list);
});

//get user by id
router.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const userToFind = users.find((user) => user.id === id);
  if (!userToFind) {
    res.status(404).send("User not found");
  }
  res.send(userToFind);
});

//save user data in-memory
router.post("/users", userValidator(userSchema), (req, res) => {
  let user = req.body;
  user = Object.assign({ id: uuid.v4() }, user); //to move id to top
  user.isDeleted = false; //default value
  users.push(user);
  res.send(user);
});

//update user data by using id
router.put("/users/:id", userValidator(userSchema), (req, res) => {
  const id = req.params.id;
  const { login, password, age } = req.body; //Imp - destructuring
  const userToUpdate = users.find((u) => u.id === id);
  if (!userToUpdate) {
    res.send("User not found");
  } else {
    userToUpdate.login = login;
    userToUpdate.password = password;
    userToUpdate.age = age;
    res.send(userToUpdate);
  }
});

//delete user data by using id
router.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const userToDelete = users.find((user) => user.id === id);
  if (!userToDelete || userToDelete.isDeleted) {
    res.send("User not found");
  } else {
    userToDelete.isDeleted = true;
    res.send();
  }
});

router.use("/",(req,res)=>{
  const msg="Rest API Task - The request are limited to following: users, users/:id use postman for check get,post,put and del"
  res.send(msg);
})

module.exports = {
  router: router,
};
