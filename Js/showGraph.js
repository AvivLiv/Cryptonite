// create new array
let symbolsArray = [];

//show report page 
function showReport() {
    $("#mainDiv").empty();
    $("#myModal").modal("hide");
    const userSearch = document.getElementById("searchInput");
    userSearch.style.background = "";
    userSearch.placeholder = "Search Currencies";
    userSearch.focus();
    if (saveCurrenciesArray.length === 0) {
        $("#chartContainer").hide();
        $("#mainDiv").append(`<div id="errorAlert" class="col-md-10  col-lg-5">
        <div id="errorDiv" class="alert alert-warning alert-dismissible fade in text-center show" role="alert">
        <strong>You should choose Currencies.</strong> 
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      </div>`)
    }

    else {
        getDataPoints();
        $("#chartContainer").show()
        var options = {
            animationEnabled: true,
            title: {
                text: saveCurrenciesArray.map(c => c.id.toUpperCase()).join(', ') + " TO USD"
            },
            subtitles: [{
                text: symbolsArray,
                cursor: "pointer",
                verticalAlign: "top",
                fontSize: 20

            }],
            axisX: {
                title: "chart updates every 2 secs"
            },
            axisY: {
                title: "Coins Value",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC",
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",

                itemclick: toggleDataSeries
            },
            data: saveCurrenciesArray.map(c => c.data),
            showInSubtitles: true
        };
        $("#chartContainer").CanvasJSChart(options);
        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }
    }
}
// create timer
let myInterval;

// get online values of currencies 
function getDataPoints() {
    symbolsArray = saveCurrenciesArray.map(s => s.symbol.toUpperCase())
    myInterval = setInterval(() => {
        getJsonFromRemoteServer(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbolsArray}&tsyms=USD`)
            .then(
                resolve => showLiveReport(resolve),
                reject => {
                    console.log("OnReject:" + reject);
                })
            .catch(err => alert("Error! Status: " + err.status + ", Text: " + err.statusText));
    }, 2000);
}

//show values on report 
function showLiveReport(value) {
    let index = 0;
    for (const item in value) {
        saveCurrenciesArray[index].data.dataPoints.push({ x: new Date(), y: value[item].USD });
        index++
        $("#chartContainer").CanvasJSChart().render();
    }
}

// stop interval
function stopInterval() {
    clearInterval(myInterval);
}
