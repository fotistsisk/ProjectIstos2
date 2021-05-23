var results;
var template;

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

window.onload = function () {
    let books = [];
    results = document.querySelector("#results");
    var booksTemplateHtml = document.querySelector(
    'script[data-name="booksTemplate"]'
    ).innerHTML;

    template = Handlebars.compile(booksTemplateHtml);

    Handlebars.registerHelper("json", function (context) {
        return JSON.stringify(context).replace(/"/g, "&quot;");
      });

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
            bookID: data[i].bookID,
          });
        }

        console.log("Succeeded", resultsText);
        bookData = null;
        var bookData = template({
          books,
        });

        results.innerHTML = bookData;
      })
      .catch((error) => {
        console.log(error);
      });
}