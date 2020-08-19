console.log($(".city-info > h3").text());
var city_dict = {};
var city_num = 1;
var checkInDict = function(city){
    if (city in city_dict){
        return true;
    }
    else{ return false;}
}

//Add city to page - Check  if the city already exists, and add only if it doesn't
var saveCity = function(city){
    if (!checkInDict(city)){
        var cityEl = $("<a href='#' class='list-group-item list-group-item-action'>" + city + "</a>");
        $("#save-search").append(cityEl);
        city_dict[city] = city_num; 
        localStorage.setItem("city_dict",JSON.stringify(city_dict));
        city_num ++;
    }
     
}

var checkForecastChildren = function(){
    if ( $('#current-forecast').children().length > 0 ) {
        $('#current-forecast').empty();
    }    
}

var checkFiveDayForecastChildren = function(){
    if ($("#five-day-forecast").children().length > 0){
        $("#five-day-forecast").empty();
    }
}

var  displayCurrentForecast = function(data){
    console.log(data.current.temp);
    console.log(data.current.humidity);
    console.log(data.current.wind_speed);
    console.log(data.current.uvi);
    checkForecastChildren();
    $("#current-forecast").append("<p class='list-group-item list-group-item-action city-list'>Temperature: " + data.current.temp  + "</p>");
    $("#current-forecast").append("<p class='list-group-item list-group-item-action city-list'>Humidity: " + data.current.humidity  + "</p>");
    $("#current-forecast").append("<p class='list-group-item list-group-item-action city-list'>Wind Speed: " + data.current.wind_speed  + "</p>");
    $("#current-forecast").append("<p class='list-group-item list-group-item-action city-list'>UV Index: <span class='bg-danger'>" + data.current.uvi + "</span></p>");
}

var fiveDayForecast = function(data){
    checkFiveDayForecastChildren();
    for (var i = 0; i<5;i++){
        
        var date = moment.unix(data.daily[i].dt).format("MM/DD/YYYY");
        //$("#five-day-forecast").append("<li class='list-group-item five-fcast'></li>");
        //$(".five-fcast").append("<h3>"+date+"</h3>");
        var icon = data.daily[i].weather[0].icon;
        var temp = data.daily[i].temp.max;
        var humidity = data.daily[i].humidity;
        var img_url = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        var img = "<img src=" + img_url + " alt='weather condition'></img>"
        var p_date = $("<p class='list-group-item list-group-item-action city-list five-fcast'>" + date + "</p>");
        var p_icon = $("<p class='list-group-item list-group-item-action city-list five-fcast'>" + img + "</p>");
        var p_temp = $("<p class='list-group-item list-group-item-action city-list five-fcast'>Temp:" + temp + "</p>");
        var p_humidity = $("<p class='list-group-item list-group-item-action city-list five-fcast'>Humidity:" + humidity + "</p>");

        var divEl = document.createElement("div");
        console.log(divEl);
        //console.log($(p_date)[0]);
        divEl.classList = "col";
        
        divEl.appendChild($(p_date)[0]);
        divEl.appendChild($(p_icon)[0]);
        divEl.appendChild($(p_temp)[0]);
        divEl.appendChild($(p_humidity)[0]);
        
        $("#five-day-forecast").append($(divEl));

    }
}


var fetchdailyForecast = function(city){
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&exclude=hourly,minutely&appid=694a639b2e1289735352059309d768a3&units=imperial&SameSite=None";
    fetch(apiURL).then(function(response){
         if(response.ok){
                response.json().then(function(data){
                         console.log($("#search").val())
                         var date = moment().format("(MM/DD/YYYY)");
                         var combo = city + " " + date
                         var lat = data.coord.lat;
                         var lon = data.coord.lon;
                         var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely,daily&dt=1586468027&appid=694a639b2e1289735352059309d768a3&units=imperial&SameSite=None";
                         fetch(url).then(function(response){
                             if(response.ok){
                                 response.json().then(function(data){
                                     displayCurrentForecast(data);
                                     console.log(data);
                                     console.log(new Date(data.daily[2].dt * 1000));
                                     console.log(data.current.weather[0].icon);
                                     var icon = data.current.weather[0].icon;
                                     var img_url = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                                     var img = "<img src=" + img_url + " alt='weather condition'></img>"
                                     var newImg = $(img);
                                     $(".city-info > h3").text(combo).append(newImg);
                                     console.log(data.daily[0].temp.max);
                                     console.log(data.daily[0].weather[0].icon);
                                     console.log(data.daily[0].humidity);
                                     fiveDayForecast(data);
                                })
                            }
                        })
                   })
          }
    })
}


$("#save-search").click(function(event){
    if($(event.target).is("a")){
        console.log($(event.target).text());
        var city  = $(event.target).text();
        var date = moment().format("(MM/DD/YYYY)");
        var combo = city + " " + date
        $(".city-info > h3").text(combo);
        fetchdailyForecast(city);
    }
})

$(".container-fluid").click(function(event){
    if($(event.target).is("button")){
        console.log($(".city-info > h3").text());
        console.log(moment().format("(MM/DD/YYYY)"));
        var date = moment().format("(MM/DD/YYYY)");
        var city  = $("#search").val();
        var combo = city + " " + date
        $(".city-info > h3").text(combo);
        saveCity(city);
        fetchdailyForecast(city);
    } 
});
