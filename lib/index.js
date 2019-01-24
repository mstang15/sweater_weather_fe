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
    eightHourForecast(weatherData);
    fiveDayForecast(weatherData);
  };
  request.send();
}

function currentWeather(response){
  printIcon(weatherIcon,response.current_weather.icon);
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
  detailedFullSumm.insertAdjacentHTML('beforeend', `Today: ${response.daily_weather.data[0].summary}`);
  // detailedTonSumm.insertAdjacentHTML('beforeend', response.daily_weather.summary);
}

function eightHourForecast(response){
  response.hourly_weather.data.length = 8;
  var hourly = response.hourly_weather.data;
  printHourForecast(hourly);
}

function fiveDayForecast(response){
  response.daily_weather.data.length = 5;
  var daily = response.daily_weather.data;
  printDayForecast(daily);
}
// 
// function printDayForecast(daily){
//   $.each(daily, function( index, data ) {
//     var icon = data.icon.toUpperCase().replace(/-/g,'_');
//     x = document.getElementById(`hour-${index + 1}`);
//     y = document.getElementById(`icon-${index + 1}`);
//     z = document.getElementById(`temp-${index + 1}`);
//     x.innerHTML = uixTimeConverter(data.time);
//     printIcon(y,icon);
//     z.innerHTML = `${data.temperature}°`;
//   });
// }

function printHourForecast(hourly){
  $.each(hourly, function( index, data ) {
    var icon = data.icon.toUpperCase().replace(/-/g,'_');
    x = document.getElementById(`hour-${index + 1}`);
    y = document.getElementById(`icon-${index + 1}`);
    z = document.getElementById(`temp-${index + 1}`);
    x.innerHTML = uixTimeConverter(data.time);
    printIcon(y,icon);
    z.innerHTML = `${data.temperature}°`;
  });
}

function printIcon(elementId, icon){
  var icons = new Skycons({"color": "black"});

  if (icon == "clear-day"){
     icons.add(elementId,Skycons.CLEAR_DAY);
   } else if (icon == "clear-night"){
     icons.add(elementId,Skycons.CLEAR_NIGHT);
   } else if (icon == "partly-cloudy-day"){
     icons.add(elementId,Skycons.PARTLY_CLOUDY_DAY);
   } else if (icon == "partly-cloudy-night"){
     icons.add(elementId,Skycons.PARTLY_CLOUDY_NIGHT);
   } else if (icon == "cloudy"){
     icons.add(elementId,Skycons.CLOUDY);
   } else if (icon == "rain"){
     icons.add(elementId,Skycons.RAIN);
   } else if (icon == "sleet"){
     icons.add(elementId,Skycons.SLEET);
   } else if (icon == "snow"){
     icons.add(elementId,Skycons.SNOW);
   } else if (icon == "wind"){
     icons.add(elementId,Skycons.WIND);
   } else {
     icons.add(elementId,Skycons.FOG);
   };
   icons.play();
}



function uixTimeConverter(uix){
  var date = new Date(uix * 1000);
  return `${date.getHours()}:00`;
}



function currentDateTime(){
  var dateAndTime = new Date();
  return `${dateAndTime.getHours()}:${dateAndTime.getMinutes()}  ${dateAndTime.getMonth() + 1}/${dateAndTime.getDate()}/${dateAndTime.getFullYear()}`;
}
