// This file is in the entry point in your webpack config.
var url = "https://morning-dusk-81767.herokuapp.com/";

var weatherIcon = document.getElementById('current-weather-icon');
var detweatherIcon = document.getElementById('detailed-weather-icon');
var weatherSummary = document.getElementById('current-weather-summary');
var weatherCurrentTemp = document.getElementById('current-weather-temp');
var weatherTodaysHigh = document.getElementById('todays-high');
var weatherTodaysLow = document.getElementById('todays-low');
var currentCity = document.getElementById('current-city');
var date = document.getElementById('current-date');
var time = document.getElementById('current-time');
var detailedSummary = document.getElementById('detailed-summary');
var detailedFeelsLike = document.getElementById('detailed-feels-like');
var detailedHumidity = document.getElementById('detailed-humidity');
var detailedVisibility = document.getElementById('detailed-visibility');
var detailedUvIndex = document.getElementById('detailed-uvindex');
var detailedFullSumm = document.getElementById('detailed-full-description');
var detailedTonSumm = document.getElementById('detailed-tonight-description');


function logIn(){
  var requestLogIn = new XMLHttpRequest();
  var log_in_url = url + 'api/v1/sessions?email=megstang@example.com&password=password';
  requestLogIn.open("POST",log_in_url, true);
  requestLogIn.onload = function(){
    var userLogInInfo = JSON.parse(requestLogIn.responseText);
    storeApiKey(userLogInInfo);
    getFavorites();
  }
  requestLogIn.send();
}

function storeApiKey(logInInfo){
  sessionStorage.setItem('api_key', logInInfo.data.attributes.api_key);
}


function getLocation(favorite){
  var city_state = document.getElementById('city-state').value;
  if (favorite!=undefined){
    var city_state = favorite
  }
  var location_url = url + "api/v1/forecast?" + "location=" + city_state;
  var requestLoc = new XMLHttpRequest();
  requestLoc.open('GET', location_url);
  requestLoc.onload = function(){
    var weatherData = JSON.parse(this.responseText).data.attributes;
    currentWeather(weatherData);
    detailedWeather(weatherData);
    eightHourForecast(weatherData);
    fiveDayForecast(weatherData);
    getFavorites();

  };
  requestLoc.send();
}

function getLocationButton(val){
  var fav = document.getElementById(`favorite-${val}`).innerHTML;
  getLocation(fav);
}


function getFavorites(){
  var get_fav_url = url + `api/v1/favorites?api_key=${sessionStorage.getItem('api_key')}`;
  var requestGetFav = new XMLHttpRequest();
  requestGetFav.open('GET', get_fav_url);
  requestGetFav.onload = function(){
    var favorites = JSON.parse(this.responseText);
    displayFavorites(favorites);
    favoriteButtonDisplay();
  };
  requestGetFav.send();
}

function displayFavorites(favorites){
  var favoritesDisplay = Object.keys(favorites.data.attributes.favorites_and_weather);
  $.each(favoritesDisplay, function(index, favorite ) {
    var x = document.getElementById(`favorite-${index + 1}`);
    x.innerHTML = favorite;
    if(index != 4){
      var y = document.getElementById(`favorite-${index + 2}`);
      y.innerHTML = ""
    };
  });
}


function currentWeather(response){
  document.getElementById("arrow-up").src = "https://s3.amazonaws.com/peoplepng/wp-content/uploads/2018/07/15072226/Up-Arrow-PNG-Picture.png"
  document.getElementById("arrow-down").src = "http://www.stickpng.com/assets/thumbs/580b57fcd9996e24bc43c457.png"
  printIcon(weatherIcon,response.current_weather.icon);
  weatherSummary.insertAdjacentHTML('beforeend', response.current_weather.summary);
  weatherCurrentTemp.insertAdjacentHTML('beforeend', `${Math.round(response.current_weather.temperature)}°`);
  weatherTodaysHigh.insertAdjacentHTML('beforeend', `${Math.round(response.daily_weather.data[0].temperatureHigh)}°`);
  weatherTodaysLow.insertAdjacentHTML('beforeend', `${Math.round(response.daily_weather.data[0].temperatureLow)}°`);
  currentCity.insertAdjacentHTML('beforeend', response.location);
  date.insertAdjacentHTML('beforeend',   currentDate());
  time.insertAdjacentHTML('beforeend',   currentTime());
}

function detailedWeather(response){
  printIcon(detweatherIcon,response.current_weather.icon);
  detailedSummary.insertAdjacentHTML('beforeend', response.current_weather.summary);
  detailedHumidity.insertAdjacentHTML('beforeend', `Humidity: ${Math.round(response.current_weather.humidity * 100)}%`);
  detailedFeelsLike.insertAdjacentHTML('beforeend',`Feels Like: ${Math.round(response.current_weather.apparentTemperature)}°`);
  detailedVisibility.insertAdjacentHTML('beforeend', `Visibility: ${response.current_weather.visibility} miles`);
  detailedUvIndex.insertAdjacentHTML('beforeend', `UV Index: ${response.current_weather.uvIndex}`);
  detailedFullSumm.insertAdjacentHTML('beforeend', `Today: ${response.daily_weather.data[0].summary}`);
}

function eightHourForecast(response){
  response.hourly_weather.data.length = 8;
  var hourly = response.hourly_weather.data;
  printHourForecast(hourly);
}


function printHourForecast(hourly){
  $.each(hourly, function(index, data ) {
    var x = document.getElementById(`hour-${index + 1}`);
    var y = document.getElementById(`icon-${index + 1}`);
    var z = document.getElementById(`temp-${index + 1}`);
    x.innerHTML = uixTimeConverter(data.time);
    printIcon(y,data.icon);
    z.innerHTML = `${data.temperature}°`;
  });
}



function printIcon(elementId, icon_tag){
  var icons = new Skycons({"color": "black"});
  var icon = icon_tag
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


function currentTime(){
  var time = new Date();
  return `${time.getHours()}:${time.getMinutes()}`;
}

function currentDate(){
  var date = new Date();
  var month = date.getMonth();
  if(month == 0){var monthWord= "January"}
  else if (month == 1){var monthWord= "February"}
  else if (month == 2){var monthWord= "March"}
  else if (month == 3){var monthWord= "April"}
  else if (month == 4){var monthWord= "May"}
  else if (month == 5){var monthWord= "June"}
  else if (month == 6){var monthWord= "July"}
  else if (month == 7){var monthWord= "August"}
  else if (month == 8){var monthWord= "September"}
  else if (month == 9){var monthWord= "October"}
  else if (month == 10){var monthWord= "November"}
  else{var monthWord= "December"};
  return `${monthWord} ${date.getDate()}, ${date.getFullYear()} `;
}


function fiveDayForecast(response){
  response.daily_weather.data.length = 5;
  var daily = response.daily_weather.data;
  printDayForecast(daily);
}

function printDayForecast(daily){
  $.each(daily, function( index, data ) {
    var dayIcon = document.getElementById(`day-${index + 1}-icon`);
    document.getElementById(`day-${index + 1}-day`).innerHTML = returnDay(data);
    document.getElementById(`day-${index + 1}-weather`).innerHTML = data.summary;
    printIcon(dayIcon,data.icon);
    document.getElementById(`arrow-up-${index+1}`).src = "https://s3.amazonaws.com/peoplepng/wp-content/uploads/2018/07/15072226/Up-Arrow-PNG-Picture.png"
    document.getElementById(`arrow-down-${index+1}`).src = "http://www.stickpng.com/assets/thumbs/580b57fcd9996e24bc43c457.png"
    document.getElementById(`day-${index + 1}-humidity`).innerHTML = `${Math.round(data.humidity * 100)}%`;
    document.getElementById(`day-${index + 1}-humidity-icon`).src="https://cdn.iconscout.com/icon/premium/png-256-thumb/humidity-22-751714.png";
    document.getElementById(`day-${index + 1}-high`).innerHTML = `${Math.round(data.temperatureHigh)}°`;
    document.getElementById(`day-${index + 1}-low`).innerHTML = `${Math.round(data.temperatureLow)}°`;
  });
}

function returnDay(data){
  var dailyDay = new Date(data.time*1000).getDay();
  if(dailyDay==0){return "Sunday"}
  else if(dailyDay==1){return "Monday"}
  else if(dailyDay==2){return "Tuesday"}
  else if(dailyDay==3){return "Wednesday"}
  else if(dailyDay==4){return "Thursday"}
  else if(dailyDay==5){return "Friday"}
  else {return "Saturday"};
}

function postFavorite(){
  var newFavorite = currentCity.innerHTML
  if(document.getElementById('add-favorite').innerHTML == "Remove Favorite"){
    delFavorite(newFavorite);
  }
  else{
  var post_fav_url = url + `api/v1/favorites?location=${newFavorite}&api_key=${sessionStorage.getItem('api_key')}`;
  var requestPosFav = new XMLHttpRequest();
  requestPosFav.open('POST',post_fav_url);
  requestPosFav.onload = function(){
    getFavorites();
  };
  requestPosFav.send();
}
}

function delFavorite(city){
  var del_fav_url = url + `api/v1/favorites?location=${city}&api_key=${sessionStorage.getItem('api_key')}`
  var requestDelFav = new XMLHttpRequest();
  requestDelFav.open('DELETE',del_fav_url);
  requestDelFav.onload = function(){
    getFavorites()
  }
  requestDelFav.send();
}

function checkIfFavorite(currentCity){
  if(currentCity == document.getElementById('favorite-1').innerHTML){return "true";}
  else if(currentCity == document.getElementById('favorite-2').innerHTML){return "true";}
  else if(currentCity == document.getElementById('favorite-3').innerHTML){return "true";}
  else if(currentCity == document.getElementById('favorite-4').innerHTML){return "true";}
  else if(currentCity == document.getElementById('favorite-5').innerHTML){return "true";};
}

function favoriteButtonDisplay(){
  var newFavorite = currentCity.innerHTML
  if (checkIfFavorite(newFavorite)=="true"){
    removeFavoriteButton();
  }
  else{

    document.getElementById('add-favorite').innerHTML = "Favorite City";
  }
}

function removeFavoriteButton(){
  document.getElementById('add-favorite').innerHTML = "Remove Favorite";
}
