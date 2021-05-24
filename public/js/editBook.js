var bookTitle;
var bookAuthor;
var queryString;
var urlParams;
var page_type;
var titleElement, authorElement, bookIDElement,reviewElement;
var book;

//send http request to server with the updated book details
function updateBook() {
  let newTitle = titleElement.value;
  let newAuthor = authorElement.value;
  let newReview = reviewElement.value;
  //check first if the user changed anything or not
  if (newTitle != book.title || newAuthor != book.author || newReview!= book.review) {
    book.title = newTitle;
    book.author = newAuthor;
    book.review = newReview;
    let url = "http://localhost:8080/editBook";
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let init = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(book),
    };

    fetch(url, init)
      .then((response) => {
        if (response.status === 200) {
          alert("Τα στοιχεία τροποποιήθηκαν με επιτυχία!");
          window.location.replace("http://localhost:8080/static/favorites.html");
        } else {
          alert("Παρουσιάστηκε πρόβλημα στην επεξεργασία του βιβλίου!");
        }
      })
      .catch((error) => {
        console.log("ERROR ", error);
      });
  }
  else{
    alert("Δεν κάνατε κάποια αλλαγή");
  }
}
//if the user hits cancel take him to the favorite's page
function cancelUpdate(){
  window.location.replace("http://localhost:8080/static/favorites.html");
}

//send request to the server in order to get the book details
function getBook(){
  queryString = window.location.search;
  urlParams = new URLSearchParams(queryString);
  let bookID = urlParams.get("id");
  let urlGet = "http://localhost:8080/getbook/" + bookID;
  let myHeaders = new Headers();


  myHeaders.append("Accept", "application/json");
  let init = {
    method: "GET",
    headers: myHeaders,
  };

  fetch(urlGet, init)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      book = {
        title: data.title,
        author: data.author,
        bookID: data.bookID,
        review: data.review
      };
      titleElement.value = book.title;
      authorElement.value = book.author;
      if(book.review!=undefined)
        reviewElement.value = book.review;
      bookIDElement.innerHTML = book.bookID;
    })
    .catch((error) => {
      console.log(error);
    });
}

window.onload = function () {
  titleElement = document.querySelector("#bookTitle");
  authorElement = document.querySelector("#bookAuthor");
  bookIDElement = document.querySelector("#idPar");
  reviewElement = document.querySelector("#review");

  getBook(); //get the book details when the page is loaded
};
