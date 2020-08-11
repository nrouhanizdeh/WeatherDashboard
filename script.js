// queryURLcurrent and queryURLforcast are the urls we'll use to query the API
var queryURLcurrent = "http://api.openweathermap.org/data/2.5/weather?";
var queryURLforcast = "http://api.openweathermap.org/data/2.5/forecast?";
var queryParams = { "appid": "b51e4fed81185bd10d4c7e74fba739ca" };
var today = moment().subtract(10, 'days').calendar();

function buildQueryURL(timeframe) {
    
    // Grab text the user typed into the search input, add to the queryParams object
    queryParams.q = $("#search-term").val().trim();
  
    if (timeframe == "current"){
        return queryURLcurrent + $.param(queryParams);
    } else{
        return queryURLforcast + $.param(queryParams);
    }

  }

var theURL;
$("#results").hide();
$(".runSearch").on("click", function(event) {
    event.preventDefault();
    $("#results").show();
    
    if (this.classList.contains("city")){
        queryParams.q = this.innerHTML;
        theURL = queryURLcurrent + $.param(queryParams);
        $("#topCardTitle").text(this.innerHTML + " (" + today + ")" );
    } else {
        theURL = buildQueryURL("current");
        $("#topCardTitle").text(($("#search-term").val().trim()) + " (" + today + ") " );
    }


    // query current wheather info for the city specified by the user
    $.ajax({
        url: theURL,
        method: "GET"
      }).then(function(response) {
        var tempFar = ((parseFloat(response.main.temp) - 273.15)*9/5 + 32).toFixed(1);
        var cityLat = response.coord.lat;
        var cityLon = response.coord.lon;

        // take the two API response Vars above, and writes them to their respetive div/img IDs on the html
        $("#currentTempreture").text("Tempreture: " + tempFar + " °F");
        $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");
        $("#currentWindSpeed").text("Wind Speed: " + response.wind.speed + " MPH");

         var queryURLuvindex = "http://api.openweathermap.org/data/2.5/uvi?"
        queryParams.lat = cityLat;
        queryParams.lon = cityLon;

        $.ajax({
            url: (queryURLuvindex + $.param(queryParams)),
            method: "GET"
        }).then(function(response) {
            $("#currentUVIndex").text("UV Index: " + response.value );

        });

        $.ajax({
            url: buildQueryURL("forcast"),
            method: "GET"
        }).then(function(response) {
            var dateAndTime = response.list[0].dt_txt
            var datelist = dateAndTime.split(" ");
            var dateFormatted = datelist[0].replace(/-/g,"/");

            var tomorrow = response.list[0].dt + 86400;
            var dtlist = [tomorrow, tomorrow + 86400 , tomorrow + 2*86400, tomorrow + 3*86400, tomorrow + 4*86400];



        });

    });


});