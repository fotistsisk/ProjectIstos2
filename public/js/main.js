window.onload = function(){
    console.log("test");
    var searchText = document.querySelector("#bookTitleInput");
    var searchButton = document.querySelector("#submitButton");
    var url1;
    var results = document.querySelector("#results");
    var booksTemplateHtml = document.querySelector('script[data-name="booksTemplate"]').innerHTML;
    var template = Handlebars.compile(booksTemplateHtml);
    var books = [];
    searchButton.onclick = function sendBookTitle(){
        url1 = "https://reststop.randomhouse.com/resources/works?search="+searchText.value;
        console.log(url1);
        let myHeaders = new Headers();
        myHeaders.append('Accept','application/json');
        let init = {
            METHOD: "GET",
            headers : myHeaders
        };
        fetch(url1,init)
            .then(response=>{
                console.log(response.headers.get("content-type"))
                return response.json();
            })
            .then(data=>{
                let dataWork = data.work;
                let resultsText = [];
                for(i=0;i<dataWork.length;i++){
                    resultsText.push(dataWork[i].titleAuth);
                }
                
                console.log("Succeeded",dataWork.length);

                resultsText.forEach(element =>{
                    books.push({title : element})
                });

                var bookData = template({
                    books
                  })


                results.innerHTML = bookData;
            })
            .catch(error=>{
                console.log(error);
            });
        return false;
    };
    
}
