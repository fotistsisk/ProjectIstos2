window.onload = function(){
    console.log("test");
    var searchText = document.querySelector("#bookTitle").innerHTML;
    var searchButton = document.querySelector("#submitButton");
    var results = document.querySelector("#results");
    var url1 = "https://reststop.randomhouse.com/resources/works?keyword=Grisham%20Christmas";
    searchButton.onclick = function sendBookTitle(){
        let myHeaders = new Headers();
        myHeaders.append('Accept','application/json');
        let init = {
            method: "GET",
            accept: 'application/json'
        };
        fetch(url1,init)
            .then(response=>{
                console.log("Succeeded",response);
                results.innerHTML = response;
            })
            .catch(error=>{
                console.log(error);
            });
        return false;
    };
    
}
