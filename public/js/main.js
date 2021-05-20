window.onload = function(){
    console.log("test");
    var searchText = document.querySelector("#bookTitleInput");
    var searchButton = document.querySelector("#submitButton");
    var url1;
    var results = document.querySelector("#results");
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
                let books = data.work;
                let resultsText ='';
                for(i=0;i<books.length;i++){
                    resultsText+=books[i].titleAuth;
                }
                
                console.log("Succeeded",books.length);
                results.innerHTML = resultsText;
            })
            .catch(error=>{
                console.log(error);
            });
        return false;
    };
    
}
