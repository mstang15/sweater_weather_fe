// This file is in the entry point in your webpack config.
var url = "http://localhost:3000/";
var request = new XMLHttpRequest();

var weatherIcon = document.getElementById('current-weather-icon');
var weatherSummary = document.getElementById('current-weather-summary');
var weatherCurrentTemp = document.getElementById('current-weather-temp');
var weatherTodaysHigh = document.getElementById('todays-high');
var weatherTodaysLow = document.getElementById('todays-low');
var currentCity = document.getElementById('current-city');
var dateTime = document.getElementById('current-date-time');
var detailedSummary = document.getElementById('detailed-summary');
var detailedFeelsLike = document.getElementById('detailed-feels-like');
var detailedHumidity = document.getElementById('detailed-humidity');
var detailedVisibility = document.getElementById('detailed-visibility');
var detailedUvIndex = document.getElementById('detailed-uvindex');
var detailedFullSumm = document.getElementById('detailed-full-description');
var detailedTonSumm = document.getElementById('detailed-tonight-description');


function getLocation(){
  var city_state = document.getElementById('city-state').value
  var location_url = url + "api/v1/forecast?" + "location=" + city_state;

  request.open('GET', location_url);
  request.onload = function(){
    var weatherData = JSON.parse(request.responseText).data.attributes;
    currentWeather(weatherData);
    detailedWeather(weatherData);
  };
  request.send();
}

function currentWeather(response){
  weatherSummary.insertAdjacentHTML('beforeend', response.current_weather.summary);
  weatherCurrentTemp.insertAdjacentHTML('beforeend', response.current_weather.temperature);
  weatherTodaysHigh.insertAdjacentHTML('beforeend', `High: ${response.daily_weather.data[0].temperatureHigh}`);
  weatherTodaysLow.insertAdjacentHTML('beforeend', `Low: ${response.daily_weather.data[0].temperatureLow}`);
  currentCity.insertAdjacentHTML('beforeend', response.location);
  dateTime.insertAdjacentHTML('beforeend',   currentDateTime());
}

function detailedWeather(response){

  detailedSummary.insertAdjacentHTML('beforeend', response.current_weather.summary);
  detailedHumidity.insertAdjacentHTML('beforeend', `Humidity: ${Math.round(response.current_weather.humidity * 100)}%`);
  detailedVisibility.insertAdjacentHTML('beforeend', `Visibility: ${response.current_weather.visibility} miles`);
  detailedUvIndex.insertAdjacentHTML('beforeend', `UV Index: ${response.current_weather.uvIndex}`);
  detailedFullSumm.insertAdjacentHTML('beforeend', `Today: ${response.daily_weather.summary}`);
  // detailedTonSumm.insertAdjacentHTML('beforeend', response.daily_weather.summary);

}

function currentDateTime(){
  var dateAndTime = new Date();
  return `${dateAndTime.getHours()}:${dateAndTime.getMinutes()}  ${dateAndTime.getMonth() + 1}/${dateAndTime.getDay()}/${dateAndTime.getFullYear()}`;
}
