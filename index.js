const express = require("express");
const path = require("path");
const fs = require("fs");
const e = require("express");
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
    console.log("ERROR",err);
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

//handle requests to add or remove books based on type attribute
app.post("/addRemoveFav", function (req, res) {
  //if we want to add a book call addBook()
  if (req.body.type === "add") {
    if (addBook(req.body)) {
      res.sendStatus(200); //if the operation was successful then return code 200
    } else {
      res.sendStatus(210); //if the book was already in favs then return code 210
    }
  } else {
    //if we want to remove a book call removeBook()
    if (removeBook(req.body)) {
      res.sendStatus(200); //if the operation was successful then return code 200
    } else {
      res.sendStatus(210); //if the operation was not successful then return code 210
    }
  }
});

//checks if the book is already in the array favBooks and adds it if it's not
//eturns false if the book is already in the array else it returns true
function addBook(newBook) {
  if (isBookInFaves(newBook.bookID)) {
    console.log("Book ", newBook.bookID, " already in favs");
    return false;
  } else {
    console.log("Book ", newBook.bookID, " was added to favs");
    favBooks.push(newBook);
    return true;
  }
}
//checks if the book is already in favs and if it is then we romove it
function removeBook(newBook) {
  if (isBookInFaves(newBook.bookID)) {
    console.log("Book ", newBook.bookID, " removed from favs");
    favBooks = favBooks.filter(function (b) {
      return b.bookID != newBook.bookID;
    });
    return true;
  } else {
    console.log("Book ", newBook.bookID, " is not in favs");
    return false;
  }
}

//checks if the book is already in array favBooks
function isBookInFaves(newBookID) {
  for (book of favBooks) {
    if (book.bookID === newBookID) {
      return true;
    }
  }
  return false;
}

//handle getAllFavs requests
app.get("/getAllFavs", function (req, res) {
    if(favBooks.length === 0){
        res.sendStatus(211) //if we don't have any fav books return status 211
    } else{
      //else send the whole array in json format
        res.header("Content-Type", "application/json");
        res.send(JSON.stringify(favBooks));
    }
});

//sends the book information based on the id in the url
app.get("/getbook/:id", function (req, res) {
    let id = req.params.id;
    for (book of favBooks) {
        if (book.bookID === id) {
            res.send(JSON.stringify(book));
        }
    }
});

//edits a book information
app.post("/editBook", function (req, res) {
    let newBook = req.body;
    for (book of favBooks) {
      if (book.bookID === newBook.bookID) {
          book.author = newBook.author;
          book.title = newBook.title;
          book.review = newBook.review;
          res.sendStatus(200);
          return;
      }
    }
    res.sendStatus(212); //send status 212 if the book is not in favBooks
});

//returns an array of all the books that include a certain string(which is in the body of the request)
app.post("/searchFavBooks", function (req, res) {
  let requestText = req.body.imputText.toLowerCase();
  let results=[];
  for (book of favBooks) {
    if (book.author.toLowerCase().includes(requestText)||book.title.toLowerCase().includes(requestText)) {
        results.push(book);
    }
  }
  res.header("Content-Type", "application/json");
  res.send(JSON.stringify(results))
});
