const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 8080;
var favBooks = [];

app.listen(port);

/* 
    Serve static content from directory "public",
    it will be accessible under path /static, 
    e.g. http://localhost:8080/static/index.html
*/
app.use("/static", express.static(__dirname + "/public"));

// parse url-encoded content from body
app.use(express.urlencoded({ extended: false }));

// parse application/json content from body
app.use(express.json());

// serve index.html as content root
app.get("/", function (req, res) {
  var options = {
    root: path.join(__dirname, "public"),
  };

  res.sendFile("index.html", options, function (err) {
    console.log(err);
  });
});

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  //res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.post("/fav", function (req, res) {
  if (!removeBook(req.body.bookID)) {
    console.log("Book ", req.body.bookID," added");
    favBooks.push(req.body);
    res.sendStatus(200);
  }
  else{
    res.sendStatus(210);
  }
});

//checks if the book is already in favs
function removeBook(newBookID) {
  for (book of favBooks) {
    if (book.bookID === newBookID) {
      favBooks = favBooks.filter(function(b) { return b.bookID != newBookID; });
      console.log("Book ", newBookID, " removed");
      return true;
    }
  }
  return false;
}
