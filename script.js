console.log("hellow world")

var city = "seattle";
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=907c23e4987ec932c6e00aa83a52deef"

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        console.log(response)
        //TODO: Get the city name from response
        var cityName = response.name;
        console.log(cityName);
        //TODO: Get the current date from the response
        var currentDate = response.timezone;
        const timezoneInMinutes = currentDate / 60;
        const currTime = moment().utcOffset(timezoneInMinutes).format("h:mm A");
        console.log(currTime);
        //TODO: get data I can use to show an icon of the weather conditions

        //TODO: SHow the current temperature

        //TODO: Show the current humidity

        //TODO: Show the wind speed

        //TODO: show the UV index
    });