//  get json
function getJsonFromRemoteServer(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            success: json => resolve(json),
            error: err => reject(err)
        });
    });
};

// creat new Array 
let currenciesArray = [];

//  get information on currencies
function getInformationCurrencies() {
    getJsonFromRemoteServer("https://api.coingecko.com/api/v3/coins")
        .then(resolve => {
            for (let i = 0; i < resolve.length; i++) {
                currenciesArray.push(resolve[i]);
            }
            displayInformationCurrencies(currenciesArray)
        },
            reject => {
                console.log("OnReject:" + reject);
            })
        .catch(err => alert("Error! Status: " + err.status + ", Text: " + err.statusText));
}

getInformationCurrencies();

// create element
let readInfoContentId;
let id;
let toggleArray = [];
let saveCurrenciesArray = [];
let currenciesArrayLocalStorage = [];

//  get display currencies by api
function displayInformationCurrencies(currenciesArray) {
    // clean  container top
    $("#containerTop").empty();
    // clean main div
    $("#mainDiv").empty();
    // create container top
    $("#containerTop").append(`<h1>Cryptonite</h1>
    <div id="optionButton">
        <button type="button" id="currenciesButton" onclick="showCurrencies()" class="btn btn-outline-primary">Home</button>
        <span class="spanTop">|</span>
        <button type="button" id="showLiveReportButton" onclick="showReport()" class="btn btn-outline-primary">Live Reports</button>
        <span class="spanTop">|</span>
        <button type="button" id="aboutButton" onclick="showAbout()" class="btn btn-outline-primary">About</button>
        <div  id="searchBox">
            <input type="text" id="searchInput"  placeholder="Search Currencies" autofocus title="Type in a name">
            <button id="searchButton" type="button" onclick="validationSearch()" class="btn btn-outline-light">Search</button>
        </div>
    </div>
    <div id="myModal" class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">List of currencies you have selected</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div><p>If these are the currencies you want to select for the reports, you can choose up to 5 only.
        If you want to change, click on the currency you want to change.</p></div>
        <div id="modalDiv" class="modal-body">
        </div>
      </div>
    </div>
  </div>`);

    // create card of currencies
    for (let i = 0; i < currenciesArray.length; i++) {
        id = currenciesArray[i].id;
        const symbol = currenciesArray[i].symbol.toUpperCase();
        const name = currenciesArray[i].name.toLowerCase();
        $("#mainDiv").append(`
        <div class="card cards" id="card${i}" style="width: 13rem;">
                <div class="card-body">
                  <h5 class="card-title">${symbol}</h5>
                  <label class="switch"  id="switchBox">
                  <input class="switchBox cardToggleButton"  type="checkbox" id="${currenciesArray[i].symbol}" >
                  <span  class="slider round" ></span>
                  </label>
                  <p class="card-text nameCard">${name}</p>
                  <div class="container">
                  <button type="button" class="btn btn-primary moreInfoButton"  id="${currenciesArray[i].id}" data-toggle="collapse" data-target="#demo${i}">More Info</button>
                  <div id="demo${i}" class="collapse">
                  <div  class="spinner-border text-primary spinerCard" role="status">
                  <span class="sr-only">Loading...</span>
                  </div>
                 </div>
                </div>
               </div>
              </div>
              `);
        readInfoContentId = `#demo${i}`;
        toggleArray.push(readInfoContentId);
        let currenciesArrayLocalStorageJsonString = localStorage.getItem("currenciesArrayLocalStorage");
        if (currenciesArrayLocalStorageJsonString !== null) {
            currenciesArrayLocalStorage = JSON.parse(currenciesArrayLocalStorageJsonString);
        }
        for (let j = 0; j < currenciesArrayLocalStorage.length; j++) {
            if (currenciesArrayLocalStorage[j].symbol === currenciesArray[i].symbol) {
                const symbolToggle = currenciesArray[i].symbol;
                $(`#${symbolToggle}`).prop('checked', true);
                saveCurrenciesArray = currenciesArrayLocalStorage;
            }
        }
    }
};

// checked if a currency in local storage and display them. 
$(document).on("click", ".moreInfoButton", function () {
    const idChecked = $(this).attr("id");
    const index = currenciesArray.findIndex(c => c.id === idChecked);
    let allCurrencies = [];
    let allCurrenciesJsonString = localStorage.getItem(`#demo${index}`);
    if (allCurrenciesJsonString != null) {
        allCurrencies = JSON.parse(allCurrenciesJsonString);
        $(`#demo${index}`).empty();
        $(`#demo${index}`).append(`<br><img src="${allCurrencies.currencyImg}"><br>`);
        $(`#demo${index}`).append("Price in USD: $" + `${allCurrencies.usd}` + "<br>Price in EUR: €" +
         `${allCurrencies.eur}` + "<br>Price in NIS: ₪" + `${allCurrencies.ils}`);
    }
    else {
        setNameCurrencies(currenciesArray[index].id, toggleArray[index], index);
        deleteCurrencyFromLocalStorage(`#demo${index}`);
    }
});

function deleteCurrencyFromLocalStorage(toggleId) {
    setTimeout(() => {
        localStorage.removeItem(toggleId);
    }, 120000)
}

// The gates of currencies.
function setNameCurrencies(coinId, divId, index) {
    getJsonFromRemoteServer("https://api.coingecko.com/api/v3/coins/" + coinId)
        .then(
            resolve => {
                const name = resolve.name;
                const currencyImg = resolve.image.thumb;
                const u = resolve.market_data.current_price.usd;
                const usd = u.toFixed(2);
                const e = resolve.market_data.current_price.eur;
                const eur = e.toFixed(2);
                const i = resolve.market_data.current_price.ils;
                const ils = i.toFixed(2);
                const currency = { name, currencyImg, usd, eur, ils };
                currenciesArrayLocalStorage.push(currency); 
                let allCurrenciesJsonString = JSON.stringify(currency);
                localStorage.setItem(`#demo${index}`, allCurrenciesJsonString);
                $(divId).empty();
                $(divId).append(`<br><img src="${currencyImg}"><br>`);
                $(divId).append("Price in USD: $" + usd + "<br>Price in EUR: €" + eur + "<br>Price in NIS: ₪" + ils);
            },
            reject => {
                console.log("OnReject:" + reject);
            })
        .catch(err => alert("Error! Status: " + err.status + ", Text: " + err.statusText));
}

// create new array
let currenciesArray2 = [];
let changeCurrencySymbol;

//checks the marked coins and push them into the array
$(document).on("click", ".cardToggleButton", function () {

    if (saveCurrenciesArray.length > 4 && $(this).prop('checked') === true) {
        $(this).prop('checked', false);
        changeCurrencySymbol = $(this).attr("id");
        displayModalCurrencies();
    }

    else {
        if ($(this).prop('checked') === true) {
            const coinsSymbol = $(this).attr("id");
            for (let i = 0; i < currenciesArray.length; i++) {
                if (currenciesArray[i].symbol === coinsSymbol) {
                    saveCurrenciesArray.push({
                        id: currenciesArray[i].id, name: currenciesArray[i].name, symbol: currenciesArray[i].symbol, data: {
                            type: 'spline',
                            name: 'Coins value', dataPoints: [{
                                x: new Date(),
                                y: 0
                            }]
                        }
                    });
                    let currenciesArrayLocalStorageJsonString = localStorage.getItem("currenciesArrayLocalStorage")
                    if (currenciesArrayLocalStorageJsonString !== null) {
                        currenciesArrayLocalStorage = JSON.parse(currenciesArrayLocalStorageJsonString);
                    }
                    currenciesArrayLocalStorage.push({
                        id: currenciesArray[i].id, name: currenciesArray[i].name, symbol: currenciesArray[i].symbol, data: {
                            type: 'spline',
                            name: 'Coins value', dataPoints: [{
                                x: new Date(),
                                y: 0
                            }]
                        }
                    });
                    currenciesArrayLocalStorageJsonString = JSON.stringify(currenciesArrayLocalStorage);
                    localStorage.setItem("currenciesArrayLocalStorage", currenciesArrayLocalStorageJsonString);
                }
            }
        }

        else {
            if ($(this).prop('checked') === false) {
                const coinsSymbol = $(this).attr("id");
                for (let i = 0; i < saveCurrenciesArray.length; i++) {
                    if (saveCurrenciesArray[i].symbol === coinsSymbol) {
                        let currenciesArrayLocalStorageJsonString = localStorage.getItem("currenciesArrayLocalStorage")
                        if (currenciesArrayLocalStorageJsonString !== null) {
                            currenciesArrayLocalStorage = JSON.parse(currenciesArrayLocalStorageJsonString);
                        }
                        currenciesArrayLocalStorage.splice(i, 1);
                        currenciesArrayLocalStorageJsonString = JSON.stringify(currenciesArrayLocalStorage);
                        localStorage.setItem("currenciesArrayLocalStorage", currenciesArrayLocalStorageJsonString);
                        saveCurrenciesArray.splice(i, 1);
                        console.log(saveCurrenciesArray);
                    }
                }
            }
        }
    }
});

// modal currencies 
function displayModalCurrencies() {
    $('#myModal').modal();
    $("#modalDiv").empty();
    for (let i = 0; i < saveCurrenciesArray.length; i++) {
        const id = saveCurrenciesArray[i].id;
        const symbol = saveCurrenciesArray[i].symbol.toUpperCase();
        $("#modalDiv").append(`
        <button type="button" id="${saveCurrenciesArray[i].symbol}" class="btn btn-outline-primary deleteButtonModal">${symbol}</button>
        `);
    }
};

// // delete button in modal
$(document).on("click", ".deleteButtonModal", function () {
    const symbolButton = $(this).attr("id");
    for (let i = 0; i < saveCurrenciesArray.length; i++) {
        if (saveCurrenciesArray[i].symbol === symbolButton) {
            saveCurrenciesArray.splice(i, 1);
            for (let j = 0; j < currenciesArray.length; j++) {
                if (currenciesArray[j].symbol === changeCurrencySymbol) {
                    const changeCurrency = {
                        id: currenciesArray[j].id, name: currenciesArray[j].name, symbol: currenciesArray[j].symbol, data: {
                            type: 'spline',
                            name: 'Coins value', dataPoints: [{
                                x: new Date(),
                                y: 0
                            }]
                        }
                    };
                    saveCurrenciesArray.push(changeCurrency);
                    for (let k = 0; k < currenciesArrayLocalStorage.length; k++) {
                        if (currenciesArrayLocalStorage[k].symbol === symbolButton) {
                            let currenciesArrayLocalStorageJsonString = localStorage.getItem("currenciesArrayLocalStorage");
                            if (currenciesArrayLocalStorageJsonString !== null) {
                                currenciesArrayLocalStorage = JSON.parse(currenciesArrayLocalStorageJsonString);
                            }
                            currenciesArrayLocalStorage.splice(k, 1);
                            currenciesArrayLocalStorage.push(changeCurrency);
                            currenciesArrayLocalStorageJsonString = JSON.stringify(currenciesArrayLocalStorage);
                            localStorage.setItem("currenciesArrayLocalStorage", currenciesArrayLocalStorageJsonString);
                        }
                    }
                }
            }
        }
        $('.cardToggleButton').each(function () {
            if ($(this).attr('id') === symbolButton) {
                $(this).prop('checked', false);
            }
        });
        $(`#${changeCurrencySymbol}`).each(function () {
            $(this).prop('checked', true);
            $("#myModal").modal("hide");
        })
        $(this).fadeOut(10);
    }
});



