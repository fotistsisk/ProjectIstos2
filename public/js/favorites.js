var results;
var template;
var searchTitle;
var booksTemplateHtml;
var searchImput;
var timerID;
var noResultsSection;

function editBook(book) {
  window.location.replace(
    "http://localhost:8080/static/editBook.html?id=" + book.bookID
  );
}

function removeFromFavs(bookObject) {
  bookObject.type = "remove";
  let urlFav = "http://localhost:8080/addRemoveFav";
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let init = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(bookObject),
  };

  fetch(urlFav, init)
    .then((response) => {
      if (response.status === 200) {
        alert("Αφαιρέθηκε από τα αγαπημένα!");
      } else {
        alert("Δεν υπάρχει στα αγαπημένα!");
      }
    })
    .catch((error) => {
      console.log("ERROR ", error);
    });
  location.reload();
}

function searchInFavs() {
  if (searchTitle.value == "") {
    results.hidden = false;
    noResults.hidden = true;
    getAllFavs();
    return;
  }
  let urlFav = "http://localhost:8080/searchFavBooks";
  let myHeaders = new Headers();
  let searchText = { imputText: searchTitle.value };
  let books = [];
  myHeaders.append("Content-Type", "application/json");
  let init = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(searchText),
  };

  fetch(urlFav, init)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        noResults.hidden = false;
        results.hidden = true;
        return;
      } else {
        results.hidden = false;
        noResults.hidden = true;
      }
      for (i = 0; i < data.length; i++) {
        books.push({
          title: data[i].title,
          author: data[i].author,
          bookID: data[i].bookID,
          review: data[i].review,
        });

        let bookData = template({
          books,
        });
        results.innerHTML = bookData;
      }
    })
    .catch((error) => {
      console.log("ERROR ", error);
    });
  return true;
}

function getAllFavs() {
  let books = [];
  url1 = "http://localhost:8080/getAllFavs";
  let myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  let init = {
    METHOD: "GET",
    headers: myHeaders,
  };
  fetch(url1, init)
    .then((response) => {
      if (response.status === 211) {
        console.log("Favs array is empty");
        noResults.hidden = false;
      } else {
        noResults.hidden = true;
      }
      return response.json();
    })
    .then((data) => {
      for (i = 0; i < data.length; i++) {
        books.push(data[i]);
      }
      let bookData = template({
        books,
      });
      results.innerHTML = bookData;
    })
    .catch((error) => {
      console.log(error);
    });
}

window.onload = function () {
  searchTitle = document.querySelector("#bookTitleInput");
  results = document.querySelector("#results");
  bookTitleInput = document.querySelector("#bookTitleInput");
  noResults = document.querySelector("#noResults");
  booksTemplateHtml = document.querySelector(
    'script[data-name="booksTemplate"]'
  ).innerHTML;

  bookTitleInput.addEventListener("keydown", function () {
    clearTimeout(timerID);
    timerID = setTimeout(searchInFavs, 500);
  });

  template = Handlebars.compile(booksTemplateHtml);

  Handlebars.registerHelper("json", function (context) {
    return JSON.stringify(context).replace(/"/g, "&quot;");
  });

  getAllFavs();
};
