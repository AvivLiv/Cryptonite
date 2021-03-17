// show about page
function showAbout() {
    stopInterval()
    $("#mainDiv").empty();
    $("#myModal").modal("hide");
    $("#chartContainer").hide();
    const userSearch = document.getElementById("searchInput");
    userSearch.style.background = "";
    userSearch.placeholder = "Search Currencies"
    userSearch.focus();
    $("#mainDiv").append(`<div class="card mb-3 aboutCard" style="max-width: 540px;">
    <div class="row no-gutters">
      <div class="col-md-4">
        <img src="/assets/images/aboutme.jpg" class="card-img" alt="...">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">About Me:</h5>
          <p class="card-text">My name is Aviv Livman, and I am 25 years old.</p>
        </div>
        <div class="card-body">
        <h5 class="card-title">About Project:</h5>
        <p class="card-text">Virtual currency information site.
       Which allows to check the current value of each currency,
       And see real-time reports of the gates of currencies.</p>
      </div>
      </div>
    </div>
  </div>`);
};

