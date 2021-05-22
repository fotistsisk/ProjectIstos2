var bookTitle;
var bookAuthor; 


function updateBook() {
  let url = window.location.href;
  let indexOfLastSlash = url.lastIndexOf("=");
  let bookID = url.slice(indexOfLastSlash + 1);
  let urlGet = "http://localhost:8080/getbook/"+bookID;
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
    console.log(data[0]);
    book = {
        title: data[0].title,
        author: data[0].author,
        bookID: data[0].bookID,
      };
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
  return false;
}
window.onload = function () {
  bookTitle = document.querySelector("#bookTitle");
  bookAuthor = document.querySelector("#bookAuthor");
};
