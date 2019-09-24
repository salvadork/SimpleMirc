let express = require("express");
let multer = require("multer");
let upload = multer({
  dest: __dirname + "/uploads/"
});
let app = express();
let cookieParser = require("cookie-parser");
let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
app.use(cookieParser());
let reloadMagic = require("./reload-magic.js");
let passwords = {};
let sessions = {};
let messages = [];
let activeUsers = {};

reloadMagic(app);
app.use("/", express.static("build"));
app.use("/uploads", express.static("uploads"))
let dbo = undefined;
let url =
  "mongodb+srv://bob:bobsue@cluster0-elj0a.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, {
  useNewUrlParser: true
}, (err, db) => {
  dbo = db.db("media-board");
});
app.get("/messages", function (req, res) {
  dbo.collection("messages").find({}).toArray((err, msgs) => {
    res.send(JSON.stringify(msgs))
  });
});
app.post("/newmessage", upload.none(), (req, res) => {
  console.log("*** inside new message");
  console.log("body", req.body);
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  activeUsers[username] = new Date() / 1;
  console.log("username", username);
  let msg = req.body.msg;
  let date = new Date().toLocaleString(undefined, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  console.log(date);
  let newMsg = {
    username: username,
    message: msg,
    timestamp: date
  };

  console.log("new message", newMsg);
  if (username) {
    dbo.collection("messages").insertOne(newMsg)
    res.send(JSON.stringify({
      success: true
    }));
    return;
  }

  console.log("updated messages", messages);
  res.send(JSON.stringify({
    success: false
  }));
});
app.post("/login", upload.none(), (req, res) => {
  console.log("**** I'm in the login endpoint");
  console.log("this is the parsed body", req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  let expectedPassword = passwords[username];
  console.log("expected password", expectedPassword);
  if (enteredPassword === expectedPassword) {
    console.log("password matches");
    let sessionId = generateId();
    console.log("generated id", sessionId);
    sessions[sessionId] = username;
    res.cookie("sid", sessionId);
    res.send(JSON.stringify({
      success: true
    }));
    return;
  }
  res.send(JSON.stringify({
    success: false
  }));
});
let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};
app.post("/signup", upload.none(), (req, res) => {
  console.log("**** I'm in the signup endpoint");
  console.log("this is the body", req.body);
  let username = req.body.username;
  let password = req.body.password;
  dbo.collection("users").findOne({
    username: username
  }, (err, user) => {
    if (err) {
      console.log("/login error", err);
      res.send(JSON.stringify({
        success: false
      }));
      return;
    }
    if (user === null) {
      dbo.collection("users").insertOne({
        username,
        password
      });
      let sessionId = generateId();
      console.log("generated id", sessionId);
      sessions[sessionId] = username;
      res.cookie("sid", sessionId);
      let date = new Date().toLocaleString(undefined, {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      let newUser = {
        username: username,
        message: "---just logged in",
        timestamp: date
      };
      dbo.collection("messages").insertOne(newUser);
      console.log("passwords object", passwords);
      res.send(JSON.stringify({
        success: true
      }));
      return
    }
    if (user.password === password) {
      let sessionId = generateId();
      console.log("generated id", sessionId);
      sessions[sessionId] = username;
      res.cookie("sid", sessionId);
      console.log("passwords object", passwords);
      let date = new Date().toLocaleString(undefined, {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      let newUser = {
        //css new userinputs
        inUser: true,
        username: username,
        message: "---just logged in",
        timestamp: date
      };
      dbo.collection("messages").insertOne(newUser);
      res.send(JSON.stringify({
        success: true
      }));
      return
    }

    res.send(JSON.stringify({
      success: false
    }));

  })
});
app.get("/auto-login", function (req, res) {
  let sessionId = req.cookies.sid;
  console.log(sessions[sessionId]);
  if (sessions[sessionId]) {
    res.send(JSON.stringify({
      logged: true
    }));
    return;
  }
  res.send(JSON.stringify({
    logged: false
  }));
});

app.get("/logout", function (req, res) {
  let sessionId = req.cookies.sid
  sessions[sessionId] = undefined
  res.send(JSON.stringify({
    success: false
  }))
})

app.get("/currentuser", function (req, res) {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  messages = messages.filter(x => {
    return x.username !== username;
  });
  console.log(username);
  res.send(JSON.stringify({
    success: true
  }));
});
app.get("/active-users", (req, res) => {
  let active = Object.keys(activeUsers);
  active = active.filter(user => {
    let activeTime = activeUsers[user];
    return new Date() / 1 - activeTime < 1000 * 60 * 5;
  });
  console.log(active);
  res.send(JSON.stringify(active));
});

app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});
app.listen(4000);