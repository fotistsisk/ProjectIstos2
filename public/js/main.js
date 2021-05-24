var results;
var template;
//adds book to favs
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

//it toggles the visibility of the results header
function toggleResultsHeader() {
  if (resultsh2.style.display === "none") {
    resultsh2.style.display = "block";
  }
}

//when the html loads
window.onload = function () {
  //querySelectors
  var searchText = document.querySelector("#bookTitleInput");
  var searchButton = document.querySelector("#submitButton");
  var noResultsSection = document.querySelector("#noResults");
  var url1;
  results = document.querySelector("#results");
  var resultsSection = document.querySelector("#resultsSection");
  var booksTemplateHtml = document.querySelector(
    'script[data-name="booksTemplate"]'
  ).innerHTML;

  //load the template from the html
  template = Handlebars.compile(booksTemplateHtml);
  Handlebars.registerHelper("json", function (context) {
    return JSON.stringify(context).replace(/"/g, "&quot;");
  });
  //hide the result section
  resultsSection.hidden = true;

  //handle click on search button
  searchButton.onclick = function sendBookTitle() {
    //fetches all the books that contain the words inside the imput (title and author)
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
        if (dataWork == undefined) {
          noResultsSection.hidden = false;
          resultsSection.hidden = true;
          return;
        } else {
          resultsSection.hidden = false;
          noResultsSection.hidden = true;
        }

        for (i = 0; i < dataWork.length; i++) {
          books.push({
            title: dataWork[i].titleweb,
            author: dataWork[i].authorweb,
            bookID: dataWork[i].workid,
          });
        }

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
    return false; //returns false in order not to reload the whole page
  };
};
