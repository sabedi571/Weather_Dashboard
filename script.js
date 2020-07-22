var apiKey = "6fed947199268268552e319f4f55325d";
var currWeatherDiv = $("#currentWeather");
var forecastDiv = $("#weatherForecast");
var forecastHourly = $("#hourlyForecast");
var citiesArray;


///call a function called return current weather for a given city name
///API Call - link the city name and API key variance by calling a $ sign.
///.get method to load data from the api server.
///.then method to call a function once api call is successfull
///function currTime to present todays date.
///Weather icon to present weather icon related to current weather. ref[https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2]

///Call the current weather Div and link different paramenteres you need. reference[https://openweathermap.org/current]

function returnCurrentWeather(cityName) {
    let apiCall = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&APPID=${apiKey}`;

    $.get(apiCall).then(function(currentweather){
        let currTime = new Date(currentweather.dt*1000);
        let weatherIcon = `https://openweathermap.org/img/wn/${currentweather.weather[0].icon}@2x.png`;

        currWeatherDiv.html(`
        <h2>${currentweather.name}, ${currentweather.sys.country}, (${currTime.getMonth()+1}/${currTime.getDate()}/${currTime.getFullYear()})<img src=${weatherIcon}></h2>
        <p>Temperature: ${currentweather.main.temp} F</p>
        <p>Humidity: ${currentweather.main.humidity}%</p>
        <p>Wind Speed: ${currentweather.wind.speed} mph</p>
        `, returnUVIndex(currentweather.coord))
       
    })
};

///write your apiCall again this time one with the forecast. 
///you use the same method as above but since its a list i use $.each method. 
///call the function i to iterate for the 5 days forecast.
///Call a if function to see if the date is valid.
///Define the forecast date and icon using weatherapi parameters. 
///append the necessary div using the .append method.



function returnWeatherForecast(cityName) {
    let apiCall = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&APPID=${apiKey}`;

    $.get(apiCall).then(function(response){
        let forecastInfo = response.list;
        forecastDiv.empty();
        $.each(forecastInfo, function(i) {
            if (!forecastInfo[i].dt_txt.includes("00:00:00")) {
                return;
            }
            let forecastDate = new Date(forecastInfo[i].dt*1000);
            let weatherIcon = `https://openweathermap.org/img/wn/${forecastInfo[i].weather[0].icon}.png`;

            forecastDiv.append(`
            <div class="col-md">
                <div class="card text-white bg-secondary">
                    <div class="card-body">
                        <h4>${forecastDate.getMonth()+1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h4>
                        <img src=${weatherIcon} alt="Icon">
                        <p>Temp: ${forecastInfo[i].main.temp} &#176;F</p>
                        <p>Humidity: ${forecastInfo[i].main.humidity}%</p>
                        

                    </div>
                </div>
            </div>
            `)
        })
    })
};


//
//uv index 3-5:moderate, 6-7 high, 8+ very high.
//used the UV index in openweathermap.org to get the api call.
// define colors and used if else method to define colors based on the severity of the uvi index.
///append to current weather div and recall Return UVIindex function above.
function returnUVIndex(coord) {
    let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coord.lat}&lon=${coord.lon}&APPID=${apiKey}`;

    $.get(queryURL).then(function(response){
        let currUVIndex = response.value;
        let uvSeverity = "green";
        let textColor = "black"
        
        if (currUVIndex >= 8) {
            uvSeverity = "red";
        } else if (currUVIndex >= 6) {
            uvSeverity = "yellow";
        } else if (currUVIndex >= 3) {
            uvSeverity = "green";
           
        }
        currWeatherDiv.append(`<p>UV Index: <span class="text-${textColor} uvPadding" style="background-color: ${uvSeverity};">${currUVIndex}</span></p>`);
    })
}

///Create and write search history.
///call a variance to get rid of the white space in case city name is 

function createHistoryButton(cityName) {
    
    
    if (!citiesArray.includes(cityName)){
        citiesArray.push(cityName);
        localStorage.setItem("localWeatherSearches", JSON.stringify(citiesArray));
    }

    $("#previousSearch").prepend(`<button class="btn btn-light cityHistoryBtn" value='${cityName}'>${cityName}</button>
    `);
}

if (localStorage.getItem("localWeatherSearches")) {
    citiesArray = JSON.parse(localStorage.getItem("localWeatherSearches"));
    writeSearchHistory(citiesArray);
} else {
    citiesArray = [];
};

function writeSearchHistory(array) {
    $.each(array, function(i) {
        createHistoryButton(array[i]);
    })
}


$("#submitCity").click(function() {
    event.preventDefault();
    let cityName = $("#cityInput").val();
    returnCurrentWeather(cityName);
    returnWeatherForecast(cityName);
    

});

$("#previousSearch").click(function() {
    let cityName = event.target.value;
    returnCurrentWeather(cityName);
    returnWeatherForecast(cityName);
})