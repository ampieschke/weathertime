//enable pressing "enter" as hitting the search button
let input = document.getElementById("search");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("submit_search").click();
  }
});

function addToLocalStorage(save_value) {
  let search_key = "search_history";
  let search_history = localStorage.getItem(search_key);
  if (search_history == null) {
    let new_hist = JSON.stringify([save_value]);
    localStorage.setItem(search_key, new_hist);
  } else {
    // Grab the value from the history array
    let past_hist = JSON.parse(search_history);
    // Push to the parsed array
    past_hist.unshift(save_value);
    // restring the array
    let new_hist = JSON.stringify(past_hist);
    // store it
    localStorage.setItem(search_key, new_hist);
  }
}

function showPastHistory() {
  $("#citySearch").empty();
  // const hist = localStorage.getItem("search_history");
  // hist !== null
  //   ? JSON.parse(hist).map((city) =>
  //       $("#citySearch").append(`<h4>${city}</h4>`)
  //     )
  //   : "";

  //slice the search history down to five
  let recent_search = JSON.parse(localStorage.getItem("search_history"));
  if (recent_search != null) {
    var recent_hist = recent_search.slice(0, 5);
    //print five most recent searches to html
    for (let i = 0; i < recent_hist.length; i++) {
      $("#citySearch").append(
        `<button class="cityclick btn btn-primary"type="button"value="${recent_hist[i]}">${recent_hist[i]}</button>`
      );
    }
  }
}

$(document).ready(() => {
  showPastHistory();
  $("#submit_search").click((e) => {
    e.preventDefault();
    let search = $("#search").val();
    addToLocalStorage(search);
    showPastHistory();
    displayCityInfo();
    $("#search").val("");
  });

  $(document).on("click", ".cityclick", function () {
    let city = $(this).attr("value");
    addToLocalStorage(city);
    showPastHistory();
    displayCityInfo();
    $(".cityclick").val("");
    console.log(city);
  });

  function displayCityInfo() {
    var city = $("#search").val().trim();
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=009898d31c9d9e7bb647f2a5e033ff5c";

    //call lat and long data for searched city
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(queryURL);
      console.log(response);
      let lat = response.coord.lat;
      let lon = response.coord.lon;

      $("#location").text(response.name + " " + moment().format("l"));
      console.log(response.name);

      //Call One Call API for Todays Data
      var queryURL2 =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=009898d31c9d9e7bb647f2a5e033ff5c";
      $.ajax({
        url: queryURL2,
        method: "GET",
      }).then(function (response) {
        console.log(queryURL2);
        console.log(response);

        // Show Current Weather Conditions
        var fTemp = Math.floor((response.current.temp - 273.15) * 1.8 + 32);
        $("#temp").text("Temp: " + fTemp + " Degrees");
        $("#humidity").text("Humidity: " + response.current.humidity + "%");
        $("#wind").text("Wind Speed: " + response.current.wind_speed + " MPH");
        $("#description").text(
          "Current Weather: " + response.current.weather[0].main
        );
        $("#uvi").text("UV Index: " + response.current.uvi);
        setUVClass();
        show_future();

        // Set UV Index Formatting
        function setUVClass() {
          if (response.current.uvi > 11) {
            $("#uvi")
              .removeClass("low moderate high veryHigh extreme")
              .addClass("extreme");
          } else if (response.current.uvi > 8) {
            $("#uvi")
              .removeClass("low moderate high extreme")
              .addClass("veryHigh");
          } else if (response.current.uvi > 6) {
            $("#uvi")
              .removeClass("low moderate veryHigh extreme")
              .addClass("high");
          } else if (response.current.uvi > 3) {
            $("#uvi")
              .removeClass("low high veryHigh extreme")
              .addClass(" moderate");
          } else if (response.current.uvi < 3) {
            $("#uvi")
              .removeClass("moderate high veryHigh extreme")
              .addClass("low");
          }
        }

        function show_future() {
          // Print out five days with appropriate formating classes
          $("#fdf").empty();
          $("#fiveDays").empty();
          $("#fdf").append(`<h2>Five Day Forecast:</h2>`);
          for (let i = 0; i < 5; i++) {
            let fTemp = Math.floor(
              (response.daily[i].temp.day - 273.15) * 1.8 + 32
            );
            let humi = response.daily[i].humidity;
            let date = moment()
              .add(i + 1, "days")
              .format("l");

            $("#fiveDays").append(`
              <div class="col-12 col-lg-2 day">
              <h4 class = "day">${date}</h2>
              <p class = "day">${fTemp} Degrees</p>
              <p class = "day">Humidity: ${humi}%</p>
                </div>`);
          }
        }
      });
    });
  }
});
