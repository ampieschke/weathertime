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
      console.log(lat);
      console.log(lon);

      $("#location").text(response.name);
      console.log(response.name);

      //Call One Call API for Data
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

        var fTemp = Math.floor((response.current.temp - 273.15) * 1.8 + 32);
        $("#temp").text("Temp: " + fTemp + "Degrees");
        console.log(fTemp);
        $("#humidity").text("Humidity: " + response.current.humidity + "%");
        console.log(response.current.humidity);
        $("#wind").text("Wind Speed: " + response.current.wind_speed + "MPH");
        console.log(response.current.wind_speed);
        $("#description").text(
          "Current Weather: " + response.current.weather[0].main
        );
        console.log(response.current.weather[0].main);
        $("#uvi").text("UV Index: " + response.current.uvi);
        console.log(response.current.uvi);
      });
    });
  }
});
