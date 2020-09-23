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

        //Onecall weather
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
        var iconCode = response.current.weather[0].icon
        var iconPath = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
        $("#weather-icon").attr('src', iconPath)

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
        console.log(uvIdx + "uv index")
        var uvColor = ""
        if (uvIdx >= "1" && uvIdx <= "2") {
            uvColor = "green";
        } else if (uvIdx >= "3" && uvIdx <= "5") {
            uvColor = "orange";
        } else if (uvIdx >= 6 && uvIdx <= 7) {
            uvColor = "red";
        } else if (uvIdx >= 8 && uvIdx <= 10) {
            uvColor = "pink";
        }
        $("#uv").attr('background-color', uvColor)
        $("#uv").text("UV Index: " + uvIdx);
        $("#uv").css("background-color", uvColor);
        console.log(uvColor + "uvColor")    
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
            $("#five-day-id").empty();
            console.log(response)
            var fiveDayArray = ["0", "7", "14", "21", "28", "35"]
            var fiveIcon
            var fiveTemp
            var fiveHumid
            for (let days = 1; days < 6; days++) {
                var futureDate = (moment().add(days, 'days').format('M D YYYY').toString());

                // build the card
                let cardBuilder = $("<div class=\"card\" style=\"width: 4rem\">");
                let divMaker = $("<div class=\"card-body\">");
                
                // Assign a date to this day
                let dateMaker = $("<h3>")
                dateMaker.text(futureDate);

                // Assign an icon to this day
                var iconCodeFive = response.list[fiveDayArray[days]].weather[0].icon;
                console.log(iconCodeFive + "icon code 5")
                let iconFiveDay = $("<img>");
                var iconPathFive = "http://openweathermap.org/img/wn/" + iconCodeFive + "@2x.png"
                iconFiveDay.attr('src', iconPathFive)

                // Assign the temperature to this day
                var fiveDayTemp = response.list[fiveDayArray[days]].main.temp;
                fiveDayTemp = Math.floor((fiveDayTemp - 273.15) * 1.8) + 32;
                let tempMaker = $("<p>");
                tempMaker.text("Temperature: " + fiveDayTemp + "°F");

                // Assign the humidity to this day
                var fiveDayHumid = response.list[fiveDayArray[days]].main.humidity;
                let humidMaker = $("<P>")
                humidMaker.text("Humidity: " + fiveDayHumid + "%")

                //Assign all elements to the div
                divMaker.append(dateMaker, iconFiveDay, tempMaker, "<br>", humidMaker);
                $("#five-day-id").append(divMaker);
            }
        })

    });
}

//========================================================================
// Searching for and adding cities
//========================================================================

//this builds the searched cities list
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

//this is the search button
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

//Taking the inpput from the searched cities list and re executing the search
$("#city-list").on("click", function(event) {
    city = ($(this).attr('id'))
    renderCities()
})

//using local storage to populate the page
function renderMemory () {
    for (let i = 0; i < 10; i++) {
    var cityButton = $("<a>")
        cityButton.addClass("w-75 p-3 list-group-item list-group-item-action")
        cityButton.attr("id", cities[i]);
        cityButton.text(localStorage.getItem(i))
        $("#city-list").append(cityButton);
    }
}
renderMemory();