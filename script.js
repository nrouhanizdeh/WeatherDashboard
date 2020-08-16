// queryURLcurrent and queryURLforcast are the urls we'll use to query the API
// var queryURLcurrent = "http://api.openweathermap.org/data/2.5/weather?";
// var queryURLforcast = "http://api.openweathermap.org/data/2.5/forecast?";
var queryParams = { "appid": "b51e4fed81185bd10d4c7e74fba739ca" };
var today = moment().subtract(10, 'days').calendar();
var theURL;

function buildQueryURLcurrent(searchCity) {
    queryParams.q = searchCity.trim();
    return "http://api.openweathermap.org/data/2.5/weather?" + $.param(queryParams);
  }
function buildQueryURLfuture(searchCity) {
    queryParams.q = searchCity.trim();
    return "http://api.openweathermap.org/data/2.5/forecast?" + $.param(queryParams);
  }

function showLocalStorage(){
    for (var i = 0; i < localStorage.length; i++){
       var localKey = localStorage.getItem(localStorage.key(i));
       
       if (localStorage.key(i).match(/city\S+/g)){
            $("table").append(`<tr><td class="card runSearch city" id=city_${localKey}>${localKey}</td></tr>`);
        }
    }
}

showLocalStorage();
$("#results").hide();
$("#notfound").hide();
var city;

$(".runSearch").on("click", function(event) {
    event.preventDefault();

    // check to see if "this" is the input search or existing table row
    if (this.classList.contains("city")) {
        city = this.innerHTML;
    } else {
        city = $("#search-term").val().trim();
        cityId = $(`#city_${city.toLowerCase()}`);
        
        // check to see if the city_<city name> tag exists. if not, add the key/value in local storage and add the table row.
        if(cityId.length === 0){
            localStorage.setItem(`city_${city.toLowerCase()}`, city.toLowerCase());
            $("table").append(`<tr><td class="card runSearch city" id=city_${city.toLowerCase()}>${city}</td></tr>`);
        }
    }
    console.log(city);
    // query current wheather info for the city specified by the user
    $.ajax({
        url: buildQueryURLcurrent(city),
        method: "GET",
        statusCode: {
            404 : function(){
                $("#results").hide();
                $("#notfound").show();
                $("#notfound").text(`${city} - Not Found`);

            },
            200 : function(response){
                $("#notfound").hide();
                $("#results").show();
                $("#topCardTitle").text(city + " (" + today + ")" );
                var tempFar = ((parseFloat(response.main.temp) - 273.15)*9/5 + 32).toFixed(1);
                var cityLat = response.coord.lat;
                var cityLon = response.coord.lon;
                // take the two API response Vars above, and writes them to their respetive div/img IDs on the html
                $("#currentTempreture").text("Tempreture: " + tempFar + " °F");
                $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");
                $("#currentWindSpeed").text("Wind Speed: " + response.wind.speed + " MPH");

                var queryURLuvindex = "http://api.openweathermap.org/data/2.5/uvi?" ;
                queryParams.lat = cityLat;
                queryParams.lon = cityLon;

                $.ajax({
                    url: (queryURLuvindex + $.param(queryParams)),
                    method: "GET"
                }).then(function(response) {
                        $("#currentUVIndex").text("UV Index: " + response.value );
                });

                $.ajax({
                    url: buildQueryURLfuture(city),
                    method: "GET"
                    }).then(function(response) {
                    var dateAndTime = response.list[0].dt_txt;
                    var datelist = dateAndTime.split(" ");
                    var dateFormatted = datelist[0].replace(/-/g,"/");

                    var tomorrow = response.list[0].dt + 86400;
                    var dtlist = [tomorrow, tomorrow + 86400 , tomorrow + 2*86400, tomorrow + 3*86400, tomorrow + 4*86400];
                });
            }}

        });


});