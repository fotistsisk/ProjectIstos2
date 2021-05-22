function addRemoveToFavs(bookObject, button) {
  console.log(button.innerHTML);

  let urlFav = "http://localhost:8080/fav";
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
        //alert("Προσθέθηκε στα αγαπημένα!");
        console.log("Saved to favs");
      } else {
        //alert("Αφαιρέθηκε από τα αγαπημένα!");
        console.log("removed from faves");
      }
      if (button.innerHTML === "Προσθήκη στα αγαπημένα") {
        button.innerHTML = "Αφαίρεση από τα αγαπημένα";
      } else{
        button.innerHTML = "Προσθήκη στα αγαπημένα";
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

  resultsh2.style.display = "none";

  Handlebars.registerHelper("json", function (context) {
    return JSON.stringify(context).replace(/"/g, "&quot;");
  });

  function toggleResultsHeader() {
    if (resultsh2.style.display === "none") {
      resultsh2.style.display = "block";
    }
  }

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
        console.log(response.headers.get("content-type"));
        return response.json();
      })
      .then((data) => {
        let dataWork = data.work;
        let resultsText = [];
        for (i = 0; i < dataWork.length; i++) {
          resultsText.push({
            title: dataWork[i].titleweb,
            author: dataWork[i].authorweb,
            bookID: dataWork[i].workid,
          });
        }

        console.log("Succeeded", dataWork.length);

        resultsText.forEach((element) => {
          books.push({
            title: element.title,
            author: element.author,
            bookID: element.bookID,
          });
        });
        bookData = null;
        var bookData = template({
          books,
        });

        toggleResultsHeader();
        results.innerHTML = bookData;
      })
      .catch((error) => {
        console.log(error);
      });
    return false;
  };
};
