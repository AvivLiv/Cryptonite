// show all currencies page
function showCurrencies() {
    stopInterval()
    $("#chartContainer").hide();
    $("#modalLiveReport").modal("hide");
    displayInformationCurrencies(currenciesArray);
    const userSearch = document.getElementById("searchInput");
    userSearch.style.background = "";
    userSearch.placeholder = "Search Currencies";
    userSearch.focus();
}
// validation:
function validationSearch() {
    const userSearch = document.getElementById("searchInput");
    const userSearchValue = userSearch.value;
    if (userSearchValue == "") {
        userSearch.style.background = "red";
        userSearch.placeholder = "Missing Currency";
        userSearch.focus();
        return;
    }
    else {
        searchCurrency();
    }
};

// search currency of all currencies 
function searchCurrency() {
    const userSearch = document.getElementById("searchInput");
    let userSearchValue = userSearch.value;
    userSearchValue = userSearchValue.toLowerCase();
    let searchCurrenciesArray = [];
    for (let i = 0; i < currenciesArray.length; i++) {
        if (currenciesArray[i].symbol.includes(userSearchValue)) {
            searchCurrenciesArray.push(currenciesArray[i]);
        }
    }

    if (searchCurrenciesArray != "") {
        $("#chartContainer").hide();
        displayInformationCurrencies(searchCurrenciesArray);
    }

    else {
        $("#searchInput").val("");
        userSearch.style.background = "red";
        userSearch.placeholder = "Don't found currencies";
    }
}