console.log($(".city-info > h3").text());
var city_dict = {};
var city_num = 1;
//var searchBtn = $("#search-button");
var checkInDict = function(city){
  if(city_dict !== null){
    if (city in city_dict){
        return true;
    }
    else{ return false;}
  }
  else{ 
      city_dict = {};
      return false; 
  }
    
}

//Add city to page - Check  if the city already exists, and add only if it doesn't
var saveCity = function(city){
    city  = city.charAt(0).toUpperCase() + city.slice(1);
    if (!checkInDict(city)){
        var cityEl = $("<a href='#' class='list-group-item list-group-item-action'>" + city + "</a>");
        $("#save-search").append(cityEl);
        city_dict[city] = city_num; 
        localStorage.setItem("city_dict",JSON.stringify(city_dict));
        city_num ++;
    }
     
}
//Check if daily forecast container has previous data, remove all children created previously 
var checkForecastChildren = function(){
    if ( $('#current-forecast').children().length > 0 ) {
        $('#current-forecast').empty();
    }    
}

//Check if five day forecast container has previous data, remove all children created previously 
var checkFiveDayForecastChildren = function(cardDeckEl){
    if (cardDeckEl.children().length > 0){
        cardDeckEl.empty();
    }
}

//display current forecast 
var  displayCurrentForecast = function(data){
    checkForecastChildren();
    var currentForecast = $("#current-forecast");
    currentForecast.append("<p class='list-group-item list-group-item-action city-list'>Temperature: " + data.current.temp  + "°F</p>");
    currentForecast.append("<p class='list-group-item list-group-item-action city-list'>Humidity: " + data.current.humidity  + "%</p>");
    currentForecast.append("<p class='list-group-item list-group-item-action city-list'>Wind Speed: " + data.current.wind_speed  + "Mph</p>");
    if (data.current.uvi > 8){
          currentForecast.append("<p class='list-group-item list-group-item-action city-list'>UV Index: <span class='bg-danger'>" + data.current.uvi + "</span></p>");
    }
    else{
          currentForecast.append("<p class='list-group-item list-group-item-action city-list'>UV Index: " + data.current.uvi + "</p");
    }
    
}

//Display 5 day forecast
var fiveDayForecast = function(data){
    var cardDeckEl = $(".card-deck");
    checkFiveDayForecastChildren(cardDeckEl);
    
    for (var i = 1; i<6;i++){
        
        var date = moment.unix(data.daily[i].dt).format("MM/DD/YYYY");
        var icon = data.daily[i].weather[0].icon;
        var temp = data.daily[i].temp.max;
        var humidity = data.daily[i].humidity;
        var img_url = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        var img = "<img src=" + img_url + " alt='weather condition'></img>"
        //Create DOM elements for date, temp, icon and humidity
        var p_date = $("<p class='list-group-item list-group-item-action city-list five-fcast'>" + date + "</p>");
        $(p_date).addClass(["card-text","bg-primary"])
        var p_icon = $("<p class='list-group-item list-group-item-action city-list five-fcast'>" + img + "</p>");
        $(p_icon).addClass(["card-text","bg-primary"])
        var p_temp = $("<p class='list-group-item list-group-item-action city-list five-fcast'>Temp:" + temp + "°F</p>");
        $(p_temp).addClass(["card-text","bg-primary"])
        var p_humidity = $("<p class='list-group-item list-group-item-action city-list five-fcast'>Humidity:" + humidity + "%</p>");
        $(p_humidity).addClass(["card-text", "bg-primary"])
        //create a card element for each of the days
        var cardEl = $("<div></div>");
        $(cardEl).addClass(["card", "bg-primary"]);
        var cardBodyEl = $("<div></div>");
        $(cardBodyEl).addClass(["card-body","text-center","bg-primary"]); 
        $(cardBodyEl).append($(p_date));
        $(cardBodyEl).append($(p_icon));
        $(cardBodyEl).append($(p_temp));
        $(cardBodyEl).append($(p_humidity));
        $(cardEl).append(cardBodyEl);
       
        $(cardDeckEl).append($(cardEl));
        

    }
}

//Fetch city forecast based on lat and long (derived from fetch for city)
var fetchCityData = function(url,combo,city){
    fetch(url).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayCurrentForecast(data);
                var icon = data.current.weather[0].icon;
                var img_url = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                var img = "<img src=" + img_url + " alt='weather condition'></img>"
                var newImg = $(img);
                $(".city-info > h3").text(combo).append(newImg);
                saveCity(city);
                fiveDayForecast(data);
                
           })
       }
   })
}

//Fetch all data (current and 5 day) for a given city
var fetchdailyForecast = function(city){
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&exclude=hourly,minutely&appid=694a639b2e1289735352059309d768a3&units=imperial&SameSite=None";
    fetch(apiURL).then(function(response){
         if(response.ok){
                response.json().then(function(data){
                     
                         var date = moment().format("(MM/DD/YYYY)");
                         var combo = city + " " + date
                         var lat = data.coord.lat;
                         var lon = data.coord.lon;
                         var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely,daily&dt=1586468027&appid=694a639b2e1289735352059309d768a3&units=imperial&SameSite=None";
                         fetchCityData(url,combo,city);
                   })
          }
          else{
                   $("#myModal").modal();
          }
    })
}

//when city is clicked from saved search history
$("#save-search").on('click','a',function(event){
    
        var city  = $(this).text();
        var date = moment().format("(MM/DD/YYYY)");
        var combo = city + " " + date
        $(".city-info > h3").text(combo);
        $("#search").attr("placeholder",city);
        fetchdailyForecast(city);
})

//give city for search
$(".container-fluid").on('click','#search-button',function(event){
   
        var city  = $("#search").val();
        if (city == null || city == " " || city == ""){
            $("#myModal").modal();
        }
        else{
            fetchdailyForecast(city);
        }
        
});

//load from local storage if data exists from previous searches.
var loadFromLocalStorage = function(){
   
    city_dict = JSON.parse(localStorage.getItem("city_dict"));
    if (city_dict !== null){
        for (var city in city_dict){
            var cityEl = $("<a href='#' class='list-group-item list-group-item-action'>" + city + "</a>");
            $("#save-search").append(cityEl);
        }
    }
}
//Calling function to load from local storage when the page is loaded.
loadFromLocalStorage();