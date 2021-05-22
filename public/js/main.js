function addToFavs(bookObject) {
  bookObject.type = "add";
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
        alert("Προσθέθηκε στα αγαπημένα!");
      } else {
        alert("Είναι ήδη στα αγαπημένα!");
      }
    })
    .catch((error) => {
      console.log("ERROR ", error);
    });
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
}

window.onload = function () {
  var searchText = document.querySelector("#bookTitleInput");
  var searchButton = document.querySelector("#submitButton");
  var url1;
  var results = document.querySelector("#results");
  var booksTemplateHtml = document.querySelector(
    'script[data-name="booksTemplate"]'
  ).innerHTML;

  var template = Handlebars.compile(booksTemplateHtml);
  var resultsh2 = document.querySelector("#resultsh2");

  Handlebars.registerHelper("json", function (context) {
    return JSON.stringify(context).replace(/"/g, "&quot;");
  });

  function toggleResultsHeader() {
    if (resultsh2.style.display === "none") {
      resultsh2.style.display = "block";
    }
  }

  if (
    window.location.pathname === "/static/index.html" ||
    window.location.pathname === "/"
  ) {
    resultsh2.style.display = "none";

    searchButton.onclick = function sendBookTitle() {
      let books = [];
      url1 =
        "https://reststop.randomhouse.com/resources/works?search=" +
        searchText.value;
      let myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      let init = {
        METHOD: "GET",
        headers: myHeaders,
      };
      fetch(url1, init)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let dataWork = data.work;
          let resultsText = [];
          for (i = 0; i < dataWork.length; i++) {
            books.push({
              title: dataWork[i].titleweb,
              author: dataWork[i].authorweb,
              bookID: dataWork[i].workid
            });
          }

          console.log("Succeeded", dataWork.length);

          bookData = null;
          var bookData = template({
            books
          });

          toggleResultsHeader();
          results.innerHTML = bookData;
        })
        .catch((error) => {
          console.log(error);
        });
      return false;
    };
  } else if (window.location.pathname === "/static/favorites.html") {
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
        }
        return response.json();
      })
      .then((data) => {
        console.log(data[0]);
        let resultsText = [];
        for (i = 0; i < data.length; i++) {
          books.push({
            title: data[i].title,
            author: data[i].author,
            bookID: data[i].bookID
          });
        }

        console.log("Succeeded", resultsText);
        bookData = null;
        var bookData = template({
          books
        });

        results.innerHTML = bookData;
      })
      .catch((error) => {
        console.log(error);
      });
    return false;
  }
};
