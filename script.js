//========================================================================
// Global Variables
//========================================================================
var city = "";
var cities = [];
var lat = ""
var long = ""
var keyCounter = 0
var currentDate = moment().format('MMMM Do YYYY, h:mm a');
var apiKey = "907c23e4987ec932c6e00aa83a52deef"



//========================================================================
// Current weather API call
//========================================================================



function getCurrentWeather() {

    var currentQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    $.ajax({
        url: currentQueryURL,
        method: "GET"
    }).then(function (coordResponse) {
        console.log(coordResponse)

        //get lat and long for oneCall
        var latCall = coordResponse.coord.lat;
        var longCall = coordResponse.coord.lon;
        lat = latCall;
        long = longCall;

        //Get the city name from response
        var cityResponse = coordResponse.name;
        $("#city-name").text(cityResponse);

        


        var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=hourly&appid=" + apiKey;
    $.ajax({
        url: oneCallURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)

        //TODO: Get the current date from the response
        var currentDate = response.timezone;
        const timezoneInMinutes = currentDate / 60;
        const currTime = moment().utcOffset(timezoneInMinutes).format("h:mm A");
        console.log(currTime);
        //TODO: get data I can use to show an icon of the weather conditions

        //Show the current temperature
        var currentTemp = response.current.temp;
        currentTemp = Math.floor((currentTemp - 273.15) * 1.8) + 32;
        $("#temperature").text("Temperature: " + currentTemp + " °F");

        //Show the current humidity
        var currentHumid = response.current.humidity;
        $("#humidity").text("Humidity: " + currentHumid + "%");

        //Show the wind speed
        var currentWind = response.current.wind_speed;
        $("#windspeed").text("Windspeed: " + currentWind + " mph");

        //Show the UV Index
        var uvIdx = response.current.uvi;
        $("#uv").text("UV Index: " + uvIdx);
    });

        //========================================================================
        // 5 day forecast
        //========================================================================

        //the response for this shows the weather for every 3 hours. Figure out how to turn this response into a 5 day forecast.
        var fiveDayURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=907c23e4987ec932c6e00aa83a52deef"

        $.ajax({
            url: fiveDayURL,
            method: "GET"
        }).then(function (response) {
            $("#five-day").empty();
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
                let cardBuilder = $("<div class=\"card\" style=\"width: 4rem\">");
                let divMaker = $("<div class=\"card-body\">");
                
                //TODO: Assign a date to this day
                let dateMaker = $("<h3>")
                dateMaker.text(futureDate);


                //TODO: Assign an icon to this day


                // Assign the temperature to this day
                var fiveDayTemp = response.list[fiveDayArray[days]].main.temp;
                fiveDayTemp = Math.floor((fiveDayTemp - 273.15) * 1.8) + 32;
                let tempMaker = $("<p>");
                tempMaker.text("Temperature: " + fiveDayTemp + "°F");

                // Assign the humidity to this day
                var fiveDayHumid = response.list[fiveDayArray[days]].main.humidity;
                let humidMaker = $("<P>")
                humidMaker.text("Humidity: " + fiveDayHumid + "%")

                //     //TODO: Assign all elements to the div
                divMaker.append(dateMaker, tempMaker, "<br>", humidMaker);
                $("#five-day").append(divMaker);
            }
        })

    });




}



//========================================================================
// Searching for and adding cities
//========================================================================

function renderCities() {
    $("#city-list").empty();
    for (let i = 0; i < cities.length; i++) {
        var cityButton = $("<a>")
        cityButton.addClass("w-75 p-3 list-group-item list-group-item-action")
        cityButton.attr("id", cities[i]);
        cityButton.text(localStorage.getItem(i))
        $("#city-list").append(cityButton);
    }
}

$("#search-button").on("click", function(event) {
    event.preventDefault()
    var cityString = $("#searchfield").val().trim();
    city = cityString
    localStorage.setItem(keyCounter, cityString)
    keyCounter++;
    cities.push(cityString)
    console.log(cities);
    renderCities();
    getCurrentWeather();
})



//========================================================================
// Applying data to the current forecast
//========================================================================