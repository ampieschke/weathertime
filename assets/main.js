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
    past_hist.push(save_value);
    // restring the array
    let new_hist = JSON.stringify(past_hist);
    // store it
    localStorage.setItem(search_key, new_hist);
  }
}

function showPastHistory() {
  $("#citySearch").empty();
  const hist = localStorage.getItem("search_history");
  hist !== null
    ? JSON.parse(hist).map((city) => $("#citySearch").prepend(`<p>${city}</p>`))
    : "";
}

$(document).ready(() => {
  showPastHistory();
  $("#submit_search").click((e) => {
    e.preventDefault();
    let search = $("#search").val();
    addToLocalStorage(search);
    showPastHistory();
    displayCityInfo();
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

        //Weather Icon Selector

        //Day 2 Weather
        $("#date1").text(moment().add(1, "days").format("l"));
        var fTemp1 = Math.floor(
          (response.daily[0].temp.day - 273.15) * 1.8 + 32
        );
        $("#temp1").text(fTemp1 + " Degrees");
        $("#humidity1").text("Humidity: " + response.daily[0].humidity + "%");
        console.log(response.daily[0].humidity);

        //Day 3 Weather
        $("#date2").text(moment().add(2, "days").format("l"));
        var fTemp2 = Math.floor(
          (response.daily[1].temp.day - 273.15) * 1.8 + 32
        );
        $("#temp2").text(fTemp2 + " Degrees");
        $("#humidity2").text("Humidity: " + response.daily[1].humidity + "%");

        //Day 4 Weather
        $("#date3").text(moment().add(3, "days").format("l"));
        var fTemp3 = Math.floor(
          (response.daily[2].temp.day - 273.15) * 1.8 + 32
        );
        $("#temp3").text(fTemp3 + " Degrees");
        $("#humidity3").text("Humidity: " + response.daily[2].humidity + "%");

        //Day 5 Weather
        $("#date4").text(moment().add(4, "days").format("l"));
        var fTemp4 = Math.floor(
          (response.daily[3].temp.day - 273.15) * 1.8 + 32
        );
        $("#temp4").text(fTemp4 + " Degrees");
        $("#humidity4").text("Humidity: " + response.daily[3].humidity + "%");

        //Day 6 Weather
        $("#date5").text(moment().add(5, "days").format("l"));
        var fTemp5 = Math.floor(
          (response.daily[4].temp.day - 273.15) * 1.8 + 32
        );
        $("#temp5").text(fTemp5 + " Degrees");
        $("#humidity5").text("Humidity: " + response.daily[4].humidity + "%");
      });
    });
  }
});
