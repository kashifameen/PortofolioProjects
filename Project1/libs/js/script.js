
let selectField = $("#countrySelect");
var marker;
var markers = L.markerClusterGroup(
    {polygonOptions: {weight: 1.5, color: '#fff', opacity: 1}}
);
selectField.prop("selectedIndex", 0);
const populateSelectFields = () => {

    return $.ajax({url: "libs/php/populateSelectFields.php", type: "GET", dataType: "json"})
}

let map = L.map("map").setView([
    0.0, 0.0
], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 16,
    attribution: "© OpenStreetMap"
}).addTo(map);
map.eachLayer(function (layer) {
    if (layer instanceof L.MarkerClusterGroup) {
        map.removeLayer(layer)
    }
})

var airportIcon = L.ExtraMarkers.icon({
    extraClasses: "fa-regular",
    icon: "fa-plane-departure",
    iconColor: "black",
    shape: "penta",
    prefix: "fa"
});

var poiIcon = L.ExtraMarkers.icon({
    extraClasses: "fa-regular",
    icon: "fa-map",
    iconColor: "black",
    shape: "circle",
    prefix: "fa",
    markerColor: "white"
});
var restaurantMarker = L.ExtraMarkers.icon({icon: "fa-utensils", prefix: "fa"});
var wikipediaIcon = L.ExtraMarkers.icon({icon: "fa-brands fa-wikipedia-w", iconColor: "black", markerColor: "white"});
var locationPinIcon = L.ExtraMarkers.icon({icon: "fa-solid fa-location-pin", iconColor: "orange", markerColar: "orange"});
var userLocationPin = L.ExtraMarkers.icon({icon: "fa-solid fa-map-pin", iconColor: "white", markerColor: "black", shape: "star"});
L.easyButton("fa-solid fa-newspaper", function () {
    $("#newsModal").modal("show");
}).addTo(map);
L.easyButton("fa-cloud-sun-rain fa-lg weatherIcon", function () {
    $("#weatherModal").modal("show");
}).addTo(map);
L.easyButton("fa-coins currencyIcon", function () {
    $("#currencyModal").modal("show");
}).addTo(map);
L.easyButton("fa-regular fa-flag flagIcon", function () {
    $("#countryModal").modal("show");
}).addTo(map);

window.addEventListener('load',function(){
    document.querySelector('body').classList.add("loaded")  
  });  
populateSelectFields().done((result) => {
    var countries = result.data;
    typeof countries;
    countries.sort((a, b) => {
        if (a.name.toString().toLowerCase() < b.name.toString().toLowerCase()) {
            return -1;
        }
        if (a.name.toString().toLowerCase() > b.name.toString().toLowerCase()) {
            return 1;
        }
        return 0;
    }),
    $.each(countries, function (i, item) {
        selectField.append($("<option></option>").text(countries[i].name).attr("value", countries[i].iso));
    })
}).then(() => {
    $(document).ready(function () {
              
        //   function onLocationFound(e) {
        //     var radius = e.accuracy;

        //     marker = L.marker(e.latlng, {icon: userLocationPin}).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
        //     L.circle(e.latlng, radius).addTo(map);
        // }
        // map.on("locationfound", onLocationFound);
        map.locate({setView: true, maxZoom: 20});

        if ("geolocation" in navigator) {
            // check geolocation available
            // try to get user current location using getCurrentPosition() method

            navigator.geolocation.getCurrentPosition(function (position) {
                map.setView([
                    position.coords.latitude, position.coords.longitude
                ], 13);
                $.ajax({
                    url: "libs/php/getOpencageApi.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                    success: function (result) {
                        console.log(result)
                       
                        var city = result.data.results[0].components.city;
                        document.getElementById("wrapper-name").innerHTML = city;

                        var countryName = result.data.results[0].components.country;
                        var localCountryCode = result.data.results[0].components.country_code;
                        var upperCaseCountryCode = localCountryCode.toUpperCase();
                        document.getElementById("countrySelect").value = upperCaseCountryCode;

                        getCountryBorder(upperCaseCountryCode).done((result) => {

                            border = L.geoJSON(result.data.geometry,{color: 'purple'}).addTo(map);
                            map.fitBounds(border.getBounds());
                        })

                        getAirports(upperCaseCountryCode).done((result) => {
                            console.log(result)
                            let airports = result.data;
                             airports.forEach(element => {

                                markers.addLayer(L.marker([
                                    element.latitude, element.longitude
                                ], {icon: airportIcon},).bindPopup(element.name + "<br> <a href=https://" + element.wikipedia_page + ">Wikipedia Link</a>"));
                            });

                            map.addLayer(markers);
                        })

                        getCountryData(localCountryCode);


                        getNews(countryName).done((result) => {
                            console.log(result)
                            document.getElementById("modalTitle").innerText = `News in ${countryName}`;
                            $.each(result.articles, function (i, item) {
                                $("#newsData").append(`<div class="row gx-5">
                      <div class="col-md-6 mb-4">
                        <div class="bg-image hover-overlay ripple shadow-2-strong rounded-5" data-mdb-ripple-color="light">
                          <img src="${
                                    result.articles[i].media
                                }" class="img-fluid" />
                          <a href="${
                                    result.articles[i].link
                                }" target="_blank">
                            <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
                          </a>
                        </div>
                      </div>
                      <div class="col-md-6 mb-4">
                      <span class="badge bg-danger px-2 py-1 shadow-1-strong mb-3">${
                                    result.articles[i].author
                                }</span>
                      <h4><strong>${
                                    result.articles[i].title
                                }</strong></h4>
                      <p class="text-muted">
                        ${
                                    result.articles[i].summary
                                }
                      </p>
                      <a href="${
                                    result.articles[i].link
                                }" target="_blank" type="button" class="btn btn-primary">Read more</a>
                    </div>`);
                            });
                        })

                        getCurrentWeatherData(position.coords.latitude, position.coords.longitude, city);
                    }
                }).then();
                getWikipediaSearch(position.coords.latitude, position.coords.longitude).done((result) => {

                    $.each(result.data, function (i, item) {
                        markers.addLayer(L.marker([
                            item.lat, item.lng
                        ], {icon: wikipediaIcon}).bindPopup(item.title + "<br> <a href=https://" + item.wikipediaUrl + ">Wikipedia Link</a>"));
                    });
                    map.addLayer(markers);
                });
                getLocalRestaurants(position.coords.latitude, position.coords.longitude).done((result) => {


                    $.each(result.data[0].pois, function (i, item) {
                        markers.addLayer(L.marker([
                            item.coordinates.latitude, item.coordinates.longitude
                        ], {icon: restaurantMarker}).bindPopup(item.name + "<br>" + item.snippet));
                    });
                    map.addLayer(markers);
                })

                getLocalHighlights(position.coords.latitude, position.coords.longitude).done((result) => {


                    $.each(result.data[0].pois, function (i, item) {
                        markers.addLayer(L.marker([
                            item.coordinates.latitude, item.coordinates.longitude
                        ], {icon: locationPinIcon}).bindPopup(item.name + "<br>" + item.snippet));
                    });
                    map.addLayer(markers);
                })
                $.ajax({
                    url: "libs/php/populateCurrencyConverter.php",
                    type: "GET",
                    dataType: "json",
                    success: function (result) {
                        console.log(result)
                        let currency = result.symbols;
                        for (const property in currency) {
                            $("#currencyIn").append($("<option></option>").text(currency[property]).attr("value", property));
                            $("#currencyOut").append($("<option></option>").text(currency[property]).attr("value", property));
                        }

                    }
                });
            }, function () {
                
                    var select = document.getElementById('countrySelect');
                    var chosenValue = select.options[select.selectedIndex].value;
                    
                    let lowerCaseValue = chosenValue.toLowerCase();

                    console.log(chosenValue)
                    console.log(lowerCaseValue)
                
                    if (markers) {
                        markers.clearLayers()
                        $('path.leaflet-interactive').remove()
                        $('.leaflet-popup').remove()
                        $('.leaflet-marker-icon').remove()
                        $('.leaflet-marker-shadow').remove()
                    }
                    let selectedText = $("#countrySelect :selected").text();
                    getCountryBorder(chosenValue).done((result) => {
                        border = L.geoJSON(result.data.geometry).addTo(map);
                        map.fitBounds(border.getBounds());
                    })
                
                    $.ajax({
                        url: "libs/php/getCountryAttractions.php",
                        type: "GET",
                        dataType: "json",
                        data: {
                            countryCode: lowerCaseValue
                        },
                        success: function (result) {
                            $.each(result.data, function (i, item) {
                                markers.addLayer(L.marker([
                                    result.data[i].coordinates.latitude,
                                    result.data[i].coordinates.longitude,
                                ], {icon: poiIcon}).bindPopup(result.data[i].name + "<br> <a href=" + result.data[i].attribution[1].url + ">More Info</a>"));
                            });
                            map.addLayer(markers);
                
                        }
                    });
                
                    getAirports(chosenValue).done((result) => {
                        $.each(result.data, function (i, item) {
                            markers.addLayer(L.marker([
                                result.data[i].latitude,
                                result.data[i].longitude
                            ], {icon: airportIcon}).bindPopup(result.data[i].name + "<br> <a href=https://" + result.data[i].pop_page + ">Wikipedia Link</a>"));
                        });
                        map.addLayer(markers);
                    })
                
                    getNews(selectedText).done((result) => {
                        console.log(result)
                        document.getElementById("newsData").innerHTML = "";
                        document.getElementById("modalTitle").innerHTML = `News in ${selectedText}`;
                        $.each(result.articles, function (i, item) {
                            $("#newsData").append(`<div class="row gx-5">
                    <div class="col-md-6 mb-4">
                      <div class="bg-image hover-overlay ripple shadow-2-strong rounded-5" data-mdb-ripple-color="light">
                        <img src="${
                                result.articles[i].media
                            }" class="img-fluid" />
                        <a href="${
                                result.articles[i].link
                            }">
                          <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
                        </a>
                      </div>
                    </div>
                    <div class="col-md-6 mb-4">
                    <span class="badge bg-danger px-2 py-1 shadow-1-strong mb-3">${
                                result.articles[i].author
                            }</span>
                    <h4><strong>${
                                result.articles[i].title
                            }</strong></h4>
                    <p class="text-muted">
                      ${
                                result.articles[i].summary
                            }
                    </p>
                    <a href="${
                                result.articles[i].link
                            }" type="button" class="btn btn-primary">Read more</a>
                  </div>`);
                        });
                
                    });
                
                    $.ajax({
                        url: "libs/php/convertCountryToLatLng.php",
                        type: "GET",
                        dataType: "json",
                        data: {
                            country: chosenValue
                        },
                        success: function (result) {
                            console.log(result)
                            document.getElementById("currencyIn").value = result.data.results[0].annotations.currency.iso_code;
                            document.getElementById("currencyOut").value = "USD";
                            
                            getCurrentWeatherData(result.data.results[0].geometry.lat, result.data.results[0].geometry.lng, selectedText);
                            getCountryData(chosenValue)
                            
                
                        }
                    });
                    $.ajax({
                        url: "libs/php/populateCurrencyConverter.php",
                        type: "GET",
                        dataType: "json",
                        success: function (result) {
                             document.getElementById("currencyIn").value = result.data.results[0].annotations.currency.iso_code;
                        document.getElementById("currencyOut").value = "USD";
                            let currency = result.symbols;
                            for (const property in currency) {
                                $("#currencyIn").append($("<option></option>").text(currency[property]).attr("value", property));
                                $("#currencyOut").append($("<option></option>").text(currency[property]).attr("value", property));
                            }
                            
                        }
                    })
                

            })


        }


    });
})
$("#countrySelect").on("change", function () {
    const chosenValue = this.value;
    let lowerCaseValue = chosenValue.toLowerCase();
    let cityName;
    console.log(cityName)
    if (markers) {
        markers.clearLayers()
        $('path.leaflet-interactive').remove()
        $('.leaflet-popup').remove()
        $('.leaflet-marker-icon').remove()
        $('.leaflet-marker-shadow').remove()
    }
    let selectedText = $("#countrySelect :selected").text();
    getCountryBorder(chosenValue).done((result) => {
        border = L.geoJSON(result.data.geometry).addTo(map);
        map.fitBounds(border.getBounds());
    })

    $.ajax({
        url: "libs/php/getCountryAttractions.php",
        type: "GET",
        dataType: "json",
        data: {
            countryCode: lowerCaseValue
        },
        success: function (result) {
            $.each(result.data, function (i, item) {
                markers.addLayer(L.marker([
                    result.data[i].coordinates.latitude,
                    result.data[i].coordinates.longitude,
                ], {icon: poiIcon}).bindPopup(result.data[i].name + "<br> <a href=" + result.data[i].attribution[1].url + ">More Info</a>"));
            });
            map.addLayer(markers);

        }
    });

    getAirports(chosenValue).done((result) => {
        $.each(result.data, function (i, item) {
            markers.addLayer(L.marker([
                result.data[i].latitude,
                result.data[i].longitude
            ], {icon: airportIcon}).bindPopup(result.data[i].name + "<br> <a href=https://" + result.data[i].pop_page + ">Wikipedia Link</a>"));
        });
        map.addLayer(markers);
    })

    getNews(selectedText).done((result) => {
        console.log(result)
        document.getElementById("newsData").innerHTML = "";
        document.getElementById("modalTitle").innerHTML = `News in ${selectedText}`;
        $.each(result.articles, function (i, item) {
            $("#newsData").append(`<div class="row gx-5">
    <div class="col-md-6 mb-4">
      <div class="bg-image hover-overlay ripple shadow-2-strong rounded-5" data-mdb-ripple-color="light">
        <img src="${
                result.articles[i].media
            }" class="img-fluid" />
        <a href="${
                result.articles[i].link
            }">
          <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
        </a>
      </div>
    </div>
    <div class="col-md-6 mb-4">
    <span class="badge bg-danger px-2 py-1 shadow-1-strong mb-3">${
                result.articles[i].author
            }</span>
    <h4><strong>${
                result.articles[i].title
            }</strong></h4>
    <p class="text-muted">
      ${
                result.articles[i].summary
            }
    </p>
    <a href="${
                result.articles[i].link
            }" type="button" class="btn btn-primary">Read more</a>
  </div>`);
        });

    });

    $.ajax({
        url: "libs/php/convertCountryToLatLng.php",
        type: "GET",
        dataType: "json",
        data: {
            country: chosenValue
        },
        success: function (result) {
            console.log(result)
            document.getElementById("currencyIn").value = result.data.results[0].annotations.currency.iso_code;
            document.getElementById("currencyOut").value = "USD";

            console.log(result.data)
           
            getCurrentWeatherData(result.data.results[0].geometry.lat, result.data.results[0].geometry.lng, selectedText);
            getCountryData(chosenValue)


        }
    });
});

$("#submitBtn").on("click", function () {
    let toCountry = $("#currencyOut :selected").val();
    let fromCountry = $("#currencyIn :selected").val();
    let amount = $("#numberToConvert").val();
    convertCurrency(toCountry, fromCountry, amount);
});

// Convert Currency Function
const convertCurrency = (toCountry, fromCountry, amount) => {
    $.ajax({
        url: "libs/php/convertCurrency.php",
        type: "GET",
        dataType: "json",
        data: {
            fromCountry,
            toCountry,
            amount
        },
        success: function (result) {
            $("#currencyOutput").html(`<input type="number" class="form-input" id="convertedAmount" placeholder="${
                result.result
            }" disabled>`);
        }
    });
}

// Get News Function to populate news modal
const getNews = (country) => {
    return $.ajax({url: "libs/php/getNews.php", type: "GET", dataType: "json", data: {
            country
        }})
}
// getCountryData Function
const getCountryData = (chosenValue) => {
    $.ajax({
        url: "libs/php/getCountryData.php",
        type: "GET",
        dataType: "json",
        data: {
            country: chosenValue
        },
        success: function (result) {
            console.log(result)
            $("#countryFlag").html(result.flag.emoji);
            $("#countryName").html(result.name);
            $("#capitalCity").html(result.capital.name);
            let objects = Object.values(result.languages);
            $.each(objects, function (i, language) {
                $("#countryLanguages").append(language + ", ");
            });
            $("#countryPopulation").html(result.population.toLocaleString("en-US"));
            $("#countryTimezone").html(result.timezone.timezone + " Code: " + result.timezone.code);
            $("#countryWiki").html(`<a href=${
                result.wiki_url
            }> More Info </a>`);
            $("#countryCurrency").html(result.currency.code);
            $.ajax({
                url: "libs/php/convertCountryToLatLng.php",
                type: "GET",
                dataType: "json",
                data: {
                    country: result.capital.name
                },
                success: function (result) {
                    console.log(result)
                   console.log('HELLO')
                    getCurrentWeatherData(result.data.results[0].geometry.lat, result.data.results[0].geometry.lng);
                    $("#wrapper-name").html(result.data.results[0].components.city);

        
                }
            })
        }
    });

}


const getCurrentWeatherData = (lat, lon) => {
    $.ajax({
        url: "libs/php/getCurrentWeatherData.php",
        type: "POST",
        dataType: "json",
        data: {
            lat,
            lon
        },
        success: function (result) {
            console.log(result) // Weather main data
            setCurrentWeatherData(result)
        }
    });

}

const setCurrentWeatherData = (result) => {
    let description = result.data.current.weather[0].description;
    let temp = Math.round(result.data.current.temp);
    let pressure = result.data.current.pressure;
    let humidity = result.data.current.humidity;
    if ((result.data.current.weather[0].id = 800)) {
        $("#wrapper-bg").css("background-image", "url('images/clear.gif')");
    } else if (result.data.current.weather[0].id >= 200 && result.data.current.weather[0].id <= 232) {
        $("#wrapper-bg").css("background-image", "url('images/thunderstorm.gif')");
    } else if (result.data.current.weather[0].id >= 300 && result.data.urrent.weather[0].id <= 531) {
        $("#wrapper-bg").css("background-image", "url('images/rain.gif')");
    } else if (result.data.current.weather[0].id >= 600 && result.data.current.weather[0].id <= 622) {
        $("#wrapper-bg").css("background-image", "url('images/snow.gif')");
    } else if (result.data.current.weather[0].id == 701 && result.data.current.weather[0].id == 711 && result.data.current.weather[0].id == 741) {
        $("#wrapper-bg").css("background-image", "url('images/fog.gif')");
    } else if (result.data.current.weather[0].id >= 801 && result.data.current.weather[0].id <= 804) {
        $("#wrapper-bg").css("background-image", "url('images/cloudy.gif')");
    }

    $("#wrapper-description").html(description);
    $("#wrapper-temp").html(temp + "°C");
    $("#wrapper-pressure").html(pressure);
    $("#wrapper-humidity").html(humidity + "%");

    // hourly temp
   
    // Weather daily data
    let tomorrowTemp = Math.round(result.data.daily[0].temp.day);
    let dATTemp = Math.round(result.data.daily[1].temp.day);

    $("#wrapper-forecast-temp-today").html(temp + "°C");
    $("#wrapper-forecast-temp-tomorrow").html(tomorrowTemp + "°C");
    $("#wrapper-forecast-temp-dAT").html(dATTemp + "°C");

    // Icons
    let iconBaseUrl = "http://openweathermap.org/img/wn/";
    let iconFormat = ".png";

    // Today
    let iconCodeToday = result.data.current.weather[0].icon;
    let iconFullyUrlToday = iconBaseUrl + iconCodeToday + iconFormat;
    $("#wrapper-icon-today").attr("src", iconFullyUrlToday);

    // Tomorrow
    let iconCodeTomorrow = result.data.daily[0].weather[0].icon;
    let iconFullyUrlTomorrow = iconBaseUrl + iconCodeTomorrow + iconFormat;
    $("#wrapper-icon-tomorrow").attr("src", iconFullyUrlTomorrow);

    // Day after tomorrow
    let iconCodeDAT = result.data.daily[1].weather[0].icon;
    let iconFullyUrlDAT = iconBaseUrl + iconCodeDAT + iconFormat;
    $("#wrapper-icon-dAT").attr("src", iconFullyUrlDAT);

   

}

const getWikipediaSearch = (lat, lng) => {
    return $.ajax({
        url: "libs/php/getWikipediaSearch.php",
        type: "POST",
        dataType: "json",
        data: {
            lat,
            lng
        }
    });
}
const getLocalRestaurants = (lat, lng) => {
    return $.ajax({
        url: "libs/php/getLocalRestaurants.php",
        type: "GET",
        dataType: "json",
        data: {
            lat,
            lng
        }
    });
}
const getCountryBorder = (countryCode) => {
    return $.ajax({url: "libs/php/getCountryBorder.php", type: "GET", dataType: "json", data: {
            countryCode
        }});

}
const getAirports = (countryCode) => {
    return $.ajax({url: "libs/php/getAirports.php", type: "GET", dataType: "json", data: {
            countryCode
        }});

}
const getLocalHighlights = (lat, lng) => {
    return $.ajax({
        url: "libs/php/getLocalHighlights.php",
        type: "GET",
        dataType: "json",
        data: {
            lat,
            lng
        }
    });
    
}
