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
