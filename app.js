const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path=require("path");


const url = "mongodb://localhost:27017/users";

mongoose
  .connect(url)
  .then(function () {
    console.log("connection successful");
  })
  .catch(function (e) {
    console.log("Error connecting to DB");
  });

  
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

const users = mongoose.model("User", userSchema);

app.post("/register", (req, res) => {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var user = new users({
    username: username,
    email: email,
    password: password,
  });
  user.save(function (err, user) {
    if (err) {
      console.log("error ", err);
    } else {
      console.log(username);
    }

    res.redirect("/login");
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  users.find({ username: username }, function (err, user) {
    if (err) {
      console.log("invalid username");
    }
    if (user) {
      if (user[0].password===password) {
        console.log(user[0].password)
        res.redirect("/");
      } else {
        console.log("invalid password");
      }
    }
    else{
      console.log("invalid")
    }
  });
});

app.listen(3000, function () {
  console.log("app listening on port 3000");
});
