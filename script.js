//========================================================================
// Global Variables
//========================================================================
var city = "seattle";
var cities = ["Philadelphia"];
var lat = ""
var long = ""
var currentDate = moment().format('MMMM Do YYYY, h:mm a');



//========================================================================
// Current weather API call
//========================================================================
    var currentQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=907c23e4987ec932c6e00aa83a52deef"

    $.ajax({
      url: currentQueryURL,
      method: "GET"
    }).then(function(response) {
        console.log(response)
        
        //TODO: Get the city name from response
        var cityName = response.name;
        var cityDiv = $("<div>");
        cityDiv.text(cityName);
        $("#city-name").append(cityDiv);
        
        //TODO: Get the current date from the response
        var currentDate = response.timezone;
        const timezoneInMinutes = currentDate / 60;
        const currTime = moment().utcOffset(timezoneInMinutes).format("h:mm A");
        console.log(currTime);
        //TODO: get data I can use to show an icon of the weather conditions

        //TODO: SHow the current temperature
        var currentTemp = response.main.temp;
        currentTemp = Math.floor((currentTemp-273.15)*1.8)+32;
        var tempP = $("<p>");
        tempP.text(currentTemp);
        $("#temperature").append("Temperature: ", currentTemp, " °F");
        
        //TODO: Show the current humidity
        var currentHumid = response.main.humidity;
        var humidP = $("<p>");
        humidP.text(currentHumid);
        $("#humidity").append("Humidity: ", currentHumid, "%");
        
        //TODO: Show the wind speed
        var currentWind = response.wind.speed
        var windP = $("<p>");
        windP.text(currentWind);
        $("#windspeed").append("Windspeed: ", currentWind, " mph");

        //TODO: get lat and long for UV index
        var latCall = response.coord.lat;
        var longCall = response.coord.lon;
        console.log(latCall);
        console.log(longCall);
        lat = latCall;
        long = longCall;
        console.log(lat);
        console.log(long);
    });

//========================================================================
// UV Index API Call
//========================================================================

    //TODO: show the UV index
var currentUvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=907c23e4987ec932c6e00aa83a52deef&lat=47.61&lon=-122.33";

$.ajax({
    url: currentUvURL,
    method: "GET"
  }).then(function(response) {
      var uvIdx = response.value
      var uvP = $("<p>");
      uvP.text(uvIdx);
      $("#uv").append("UV Index: ", uvIdx);
  });

//========================================================================
// 5 day forecast
//========================================================================

//the response for this shows the weather for every 3 hours. Figure out how to turn this response into a 5 day forecast.
var fiveDayURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=907c23e4987ec932c6e00aa83a52deef"

$.ajax({
    url: fiveDayURL,
    method: "GET"
}).then(function(response) {
    console.log(response)
    var fiveDayArray = ["0", "7", "14", "21", "28", "35"]
    var fiveIcon
    var fiveTemp
    var fiveHumid
    for (let days = 1; days < 6; days++) {
       var futureDate = (moment().add(days, 'days').format('M D YYYY').toString());
       
       console.log(futureDate)
       console.log(fiveDayArray[days])


       //TODO: build the card
       let cardBuilder = $("<div class=\"card\" style=\"width: 8rem\">");
       let  divMaker = $("<div class=\"card-body\">");
       //TODO: Assign a date to this day
       let dateMaker = $("<h3>")
       dateMaker.text(futureDate);

       
    //    //TODO: Assign an icon to this day
       
    //    let iconMaker = $("<div>")

       //TODO: Assign the temperature to this day
       var fiveDayTemp = response.list[fiveDayArray[days]].main.temp;
       fiveDayTemp = Math.floor((fiveDayTemp-273.15)*1.8)+32;
       let tempMaker = $("<p>");
       tempMaker.text("Temperature: " + fiveDayTemp + "°F");
       //TODO: Assign the humidity to this day
       var fiveDayHumid = response.list[fiveDayArray[days]].main.humidity;
       let humidMaker = $("<P>")
       humidMaker.text("Humidity: " + fiveDayHumid + "%")
    
    //     //TODO: Assign all elements to the div
        divMaker.append(dateMaker, tempMaker, "<br>", humidMaker);
        $("#five-day").append(divMaker);
    }
})



//========================================================================
// Searching for and adding cities
//========================================================================

function renderCities() {
    $("#city-list").empty();
    for (let i = 0; i < cities.length; i++) {
        var cityButton = $("<a>")
        cityButton.addClass("list-group-item list-group-item-action")
        cityButton.attr("data-name", cities[i]);
        cityButton.text(cities[i]);
        $("city-list").append(cityButton);
    }
}

$("#add-city").on("click", function (event) {
    event.preventDefault();
    var city = $("#cities-input").val().trim();
    cities.push(city);
    renderCities();
})

//========================================================================
// Applying data to the current forecast
//========================================================================