var countryName;
var countryName2;

let map = L.map("map").setView([
    0.0, 0.0
], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 16,
    attribution: "© OpenStreetMap"
}).addTo(map);
console.log(map.getBounds().getNorth());
console.log(map.getBounds());

var airportIcon = L.ExtraMarkers.icon({
    extraClasses: "fa-regular",
    icon: "fa-plane-departure",
    iconColor: "black",
    shape: "penta",
    prefix: "fa"
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

$(document).ready(function () {
    console.log("ready");

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
                    console.log(result);
                    var city = result.data.results[0].components.city;
                    document.getElementById("wrapper-name").innerHTML = city;
                    document.getElementById("currentCountryCurrency").innerHTML = "<h4> Current Country Currency: " + result.data.results[0].annotations.currency.name + "</h4>";

                    var countryName = result.data.results[0].components.country;
                    var localCountryCode = result.data.results[0].components.country_code;
                    var upperCaseCountryCode = localCountryCode.toUpperCase();
                    console.log(upperCaseCountryCode);
                    $.ajax({
                        url: "libs/php/populateSelectFields.php",
                        type: "GET",
                        dataType: "json",
                        success: function (result) {
                            let countries = result.data;
                            console.log(countries);
                            typeof countries;

                            countries.sort((a, b) => {
                                if (a.name.toString().toLowerCase() < b.name.toString().toLowerCase()) {
                                    return -1;
                                }
                                if (a.name.toString().toLowerCase() > b.name.toString().toLowerCase()) {
                                    return 1;
                                }
                                return 0;
                            });
                            $.each(countries, function (i, item) {
                                selectField.append($("<option></option>").text(countries[i].name).attr("value", countries[i].iso));
                            });
                        }
                    });
                    $.ajax({
                        url: "libs/php/getCountryBorder.php",
                        type: "GET",
                        dataType: "json",
                        data: {
                            countryCode: upperCaseCountryCode
                        },
                        success: function (result) {
                            console.log(result);
                            let border = L.geoJSON(result.data.geometry).addTo(map);
                            map.fitBounds(border.getBounds());
                        }
                    });
                    $.ajax({
                        url: "libs/php/getAirports.php",
                        type: "GET",
                        dataType: "json",
                        data: {
                            countryCode: upperCaseCountryCode
                        },
                        success: function (result) {
                            var markers = L.markerClusterGroup();
                            let airports = result.data;
                            airports.forEach(function (element, i) {
                                markers.addLayer(L.marker([
                                    result.data[i].latitude,
                                    result.data[i].longitude
                                ], {icon: airportIcon}).bindPopup(result.data[i].name + "<br> <a href=https://" + result.data[i].wikipedia_page + ">Wikipedia Link</a>"));
                            });

                            map.addLayer(markers);
                        }
                    });
                    console.log(countryName);
                    $.ajax({
                        url: "libs/php/getCountryData.php",
                        type: "GET",
                        dataType: "json",
                        data: {
                            country: localCountryCode
                        },
                        success: function (result) {
                            console.log(result);
                            console.log(result.languages);
                            document.getElementById("countryFlag").innerHTML = result.flag.emoji;
                            document.getElementById("countryName").innerHTML = result.name;
                            document.getElementById("capitalCity").innerHTML = result.capital.name;
                            let objects = Object.values(result.languages);
                            $.each(objects, function (i, item) {
                                document.getElementById("countryLanguages").append(objects[i] + ", ");
                            });
                            document.getElementById("countryPopulation").innerHTML = result.population.toLocaleString("en-US");
                            document.getElementById("countryTimezone").innerHTML = result.timezone.timezone + " Code: " + result.timezone.code;
                            document.getElementById("countryWiki").innerHTML = `<a href=${
                                result.wiki_url
                            }> More Info </a>`;
                            document.getElementById("countryCurrency").innerHTML = result.currency.code;
                        }
                    });
                    $.ajax({
                        url: "libs/php/getNews.php",
                        type: "GET",
                        dataType: "json",
                        data: {
                            country: countryName
                        },
                        success: function (result) {
                            console.log(result);
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
                        }
                    });
                }
            }).then();
            $.ajax({
                url: "libs/php/getCurrentWeatherData.php",
                type: "POST",
                dataType: "json",
                data: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                },
                success: function (result) { // Weather main data
                    console.log(result);
                    let main = result.data.current.weather[0].main;
                    let description = result.data.current.weather[0].description;
                    let temp = Math.round(result.data.current.temp);
                    let pressure = result.data.current.pressure;
                    let humidity = result.data.current.humidity;
                    if ((result.data.current.weather[0].id = 800)) {
                        document.getElementById("wrapper-bg").style.backgroundImage = "url('images/clear.gif')";
                    } else if (result.data.current.weather[0].id >= 200 && result.data.current.weather[0].id <= 232) {
                        document.getElementById("wrapper-bg").style.backgroundImage = "url('images/thunderstorm.gif')";
                    } else if (result.data.current.weather[0].id >= 300 && result.data.urrent.weather[0].id <= 531) {
                        document.getElementById("wrapper-bg").style.backgroundImage = "url('images/rain.gif')";
                    } else if (result.data.current.weather[0].id >= 600 && result.data.current.weather[0].id <= 622) {
                        document.getElementById("wrapper-bg").style.backgroundImage = "url('images/snow.gif')";
                    } else if (result.data.current.weather[0].id == 701 && result.data.current.weather[0].id == 711 && result.data.current.weather[0].id == 741) {
                        document.getElementById("wrapper-bg").style.backgroundImage = "url('images/fog.gif')";
                    } else if (result.data.current.weather[0].id >= 801 && result.data.current.weather[0].id <= 804) {
                        document.getElementById("wrapper-bg").style.backgroundImage = "url('images/cloudy.gif')";
                    }

                    document.getElementById("wrapper-description").innerHTML = description;
                    document.getElementById("wrapper-temp").innerHTML = temp + "°C";
                    document.getElementById("wrapper-pressure").innerHTML = pressure;
                    document.getElementById("wrapper-humidity").innerHTML = humidity + "°C";

                    // Weather hourly data
                    let hourNow = Math.round(result.data.hourly[0].temp);
                    let hour1 = Math.round(result.data.hourly[1].temp);
                    let hour2 = Math.round(result.data.hourly[2].temp);
                    let hour3 = Math.round(result.data.hourly[3].temp);
                    let hour4 = Math.round(result.data.hourly[4].temp);
                    let hour5 = Math.round(result.data.hourly[5].temp);

                    document.getElementById("wrapper-hour-now").innerHTML = hourNow + "°C";
                    document.getElementById("wrapper-hour1").innerHTML = hour1 + "°C";
                    document.getElementById("wrapper-hour2").innerHTML = hour2 + "°C";
                    document.getElementById("wrapper-hour3").innerHTML = hour3 + "°C";
                    document.getElementById("wrapper-hour4").innerHTML = hour4 + "°C";
                    document.getElementById("wrapper-hour5").innerHTML = hour5 + "°C";

                    // Time
                    let timeNow = new Date().getHours();
                    let time1 = timeNow + 1;
                    let time2 = time1 + 1;
                    let time3 = time2 + 1;
                    let time4 = time3 + 1;
                    let time5 = time4 + 1;

                    document.getElementById("wrapper-time1").innerHTML = time1;
                    document.getElementById("wrapper-time2").innerHTML = time2;
                    document.getElementById("wrapper-time3").innerHTML = time3;
                    document.getElementById("wrapper-time4").innerHTML = time4;
                    document.getElementById("wrapper-time5").innerHTML = time5;

                    // Weather daily data
                    let tomorrowTemp = Math.round(result.data.daily[0].temp.day);
                    let dATTemp = Math.round(result.data.daily[1].temp.day);

                    document.getElementById("wrapper-forecast-temp-today").innerHTML = temp + "°C";
                    document.getElementById("wrapper-forecast-temp-tomorrow").innerHTML = tomorrowTemp + "°C";
                    document.getElementById("wrapper-forecast-temp-dAT").innerHTML = dATTemp + "°C";

                    // Icons
                    let iconBaseUrl = "http://openweathermap.org/img/wn/";
                    let iconFormat = ".png";

                    // Today
                    let iconCodeToday = result.data.current.weather[0].icon;
                    let iconFullyUrlToday = iconBaseUrl + iconCodeToday + iconFormat;
                    document.getElementById("wrapper-icon-today").src = iconFullyUrlToday;

                    // Tomorrow
                    let iconCodeTomorrow = result.data.daily[0].weather[0].icon;
                    let iconFullyUrlTomorrow = iconBaseUrl + iconCodeTomorrow + iconFormat;
                    document.getElementById("wrapper-icon-tomorrow").src = iconFullyUrlTomorrow;

                    // Day after tomorrow
                    let iconCodeDAT = result.data.daily[1].weather[0].icon;
                    let iconFullyUrlDAT = iconBaseUrl + iconCodeDAT + iconFormat;
                    document.getElementById("wrapper-icon-dAT").src = iconFullyUrlDAT;

                    // Icons hourly

                    // Hour now
                    let iconHourNow = result.data.hourly[0].weather[0].icon;
                    let iconFullyUrlHourNow = iconBaseUrl + iconHourNow + iconFormat;
                    document.getElementById("wrapper-icon-hour-now").src = iconFullyUrlHourNow;

                    // Hour1
                    let iconHour1 = result.data.hourly[1].weather[0].icon;
                    let iconFullyUrlHour1 = iconBaseUrl + iconHour1 + iconFormat;
                    document.getElementById("wrapper-icon-hour1").src = iconFullyUrlHour1;

                    // Hour2
                    let iconHour2 = result.data.hourly[2].weather[0].icon;
                    let iconFullyUrlHour2 = iconBaseUrl + iconHour2 + iconFormat;
                    document.getElementById("wrapper-icon-hour2").src = iconFullyUrlHour1;

                    // Hour3
                    let iconHour3 = result.data.hourly[3].weather[0].icon;
                    let iconFullyUrlHour3 = iconBaseUrl + iconHour3 + iconFormat;
                    document.getElementById("wrapper-icon-hour3").src = iconFullyUrlHour3;

                    // Hour4
                    let iconHour4 = result.data.hourly[4].weather[0].icon;
                    let iconFullyUrlHour4 = iconBaseUrl + iconHour4 + iconFormat;
                    document.getElementById("wrapper-icon-hour4").src = iconFullyUrlHour4;

                    // Hour5
                    let iconHour5 = result.data.hourly[5].weather[0].icon;
                    let iconFullyUrlHour5 = iconBaseUrl + iconHour5 + iconFormat;
                    document.getElementById("wrapper-icon-hour5").src = iconFullyUrlHour5;
                }
            });
            $.ajax({
                url: "libs/php/getWikipediaSearch.php",
                type: "POST",
                dataType: "json",
                data: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                success: function (result) {
                    console.log(result);
                    var markers = L.markerClusterGroup();

                    $.each(result.data, function (i, item) {
                        markers.addLayer(L.marker([
                            result.data[i].lat,
                            result.data[i].lng
                        ], {icon: wikipediaIcon}).bindPopup(result.data[i].title + "<br> <a href=https://" + result.data[i].wikipediaUrl + ">Wikipedia Link</a>"));
                    });
                    map.addLayer(markers);
                }
            });

            $.ajax({
                url: "libs/php/getLocalRestaurants.php",
                type: "GET",
                dataType: "json",
                data: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                success: function (result) {
                    console.log(result);
                    var markers = L.markerClusterGroup();
                    $.each(result.data[0].pois, function (i, item) {
                        markers.addLayer(L.marker([
                            item.coordinates.latitude, item.coordinates.longitude
                        ], {icon: restaurantMarker}).bindPopup(item.name + "<br>" + item.snippet));
                    });
                    map.addLayer(markers);
                }
            });
            $.ajax({
                url: "libs/php/getLocalHighlights.php",
                type: "GET",
                dataType: "json",
                data: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                success: function (result) {
                    console.log(result);
                    var markers = L.markerClusterGroup();
                    $.each(result.data[0].pois, function (i, item) {
                        markers.addLayer(L.marker([
                            item.coordinates.latitude, item.coordinates.longitude
                        ], {icon: locationPinIcon}).bindPopup(item.name + "<br>" + item.snippet));
                    });
                    map.addLayer(markers);
                }
            });

            $.ajax({
                url: "libs/php/getNearbyPlaces.php",
                type: "GET",
                dataType: "json",
                data: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                success: function (result) {
                    console.log(result);
                }
            }),
            $.ajax({
                url: "libs/php/populateCurrencyConverter.php",
                type: "GET",
                dataType: "json",
                success: function (result) {
                    console.log(result.symbols);
                    let currency = result.symbols;
                    for (const property in currency) {
                        $("#currencyIn").append($("<option></option>").text(currency[property]).attr("value", property));
                        $("#currencyOut").append($("<option></option>").text(currency[property]).attr("value", property));
                    }
                }
            });
        });
    } else {
        $.ajax({
            url: "libs/php/getIpGeoLocation.php",
            type: "GET",
            dataType: "json",
            success: function (result) {
                console.log(result);
                var ipLocationLat = result.location.latitude;
                var ipLocationLng = result.location.longitude;
                c;
                $.ajax({
                    url: "libs/php/getOpencageApi.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        lat: ipLocationLat,
                        lng: ipLocationLng
                    },
                    success: function (result) {
                        console.log(result.data);
                        var city = result.data.results[0].components.city;
                        var countryName = result.data.results[0].components.country;
                        var localCountryCode = result.data.results[0].components.country_code;
                        var upperCaseCountryCode = localCountryCode.toUpperCase();
                        $("#countrySelect").val(upperCaseCountryCode).change();

                        document.getElementById("wrapper-name").innerHTML = city;
                        document.getElementById("currentCountryCurrency").innerHTML = "<h4> Current Country Currency: " + result.data.results[0].annotations.currency.name + "</h4>";
                        document.getElementById("countrySelect").innerHTML = countryName;

                        $.ajax({
                            url: "libs/php/getAirports.php",
                            type: "GET",
                            dataType: "json",
                            data: {
                                countryCode: upperCaseCountryCode
                            },
                            success: function (result) {
                                console.log(result);
                                var markers = L.markerClusterGroup();
                                $.each(result.data, function (i, item) {
                                    markers.addLayer(L.marker([
                                        result.data[i].latitude,
                                        result.data[i].longitude
                                    ], {icon: airportIcon}).bindPopup(result.data[i].name + "<br> <a href=https://" + result.data[i].wikipedia_page + ">Wikipedia Link</a>"));
                                });
                                map.addLayer(markers);
                            }
                        });
                        console.log(countryName);
                        $.ajax({
                            url: "libs/php/getCountryData.php",
                            type: "GET",
                            dataType: "json",
                            data: {
                                country: localCountryCode
                            },
                            success: function (result) {
                                console.log(result);
                                console.log(result.languages);
                                document.getElementById("countryFlag").innerHTML = result.flag.emoji;
                                document.getElementById("countryName").innerHTML = result.name;
                                document.getElementById("capitalCity").innerHTML = result.capital.name;
                                let objects = Object.values(result.languages);
                                $.each(objects, function (i, item) {
                                    document.getElementById("countryLanguages").append(objects[i] + ", ");
                                });
                                document.getElementById("countryPopulation").innerHTML = result.population.toLocaleString("en-US");
                                document.getElementById("countryTimezone").innerHTML = result.timezone.timezone + " Code: " + result.timezone.code;
                                document.getElementById("countryWiki").innerHTML = `<a href=${
                                    result.wiki_url
                                }> More Info </a>`;
                                document.getElementById("countryCurrency").innerHTML = result.currency.code;
                            }
                        });
                        $.ajax({
                            url: "libs/php/getNews.php",
                            type: "GET",
                            dataType: "json",
                            data: {
                                country: countryName
                            },
                            success: function (result) {
                                console.log(result);
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
                            }
                        });
                    }
                }).then();
                $.ajax({
                    url: "libs/php/getCurrentWeatherData.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        lat: ipLocationLat,
                        lon: ipLocationLng
                    },
                    success: function (result) { // Weather main data
                        console.log(result);
                        let main = result.data.current.weather[0].main;
                        let description = result.data.current.weather[0].description;
                        let temp = Math.round(result.data.current.temp);
                        let pressure = result.data.current.pressure;
                        let humidity = result.data.current.humidity;
                        if ((result.data.current.weather[0].id = 800)) {
                            document.getElementById("wrapper-bg").style.backgroundImage = "url('images/clear.gif')";
                        } else if (result.data.current.weather[0].id >= 200 && result.data.current.weather[0].id <= 232) {
                            document.getElementById("wrapper-bg").style.backgroundImage = "url('images/thunderstorm.gif')";
                        } else if (result.data.current.weather[0].id >= 300 && result.data.urrent.weather[0].id <= 531) {
                            document.getElementById("wrapper-bg").style.backgroundImage = "url('images/rain.gif')";
                        } else if (result.data.current.weather[0].id >= 600 && result.data.current.weather[0].id <= 622) {
                            document.getElementById("wrapper-bg").style.backgroundImage = "url('images/snow.gif')";
                        } else if (result.data.current.weather[0].id == 701 && result.data.current.weather[0].id == 711 && result.data.current.weather[0].id == 741) {
                            document.getElementById("wrapper-bg").style.backgroundImage = "url('images/fog.gif')";
                        } else if (result.data.current.weather[0].id >= 801 && result.data.current.weather[0].id <= 804) {
                            document.getElementById("wrapper-bg").style.backgroundImage = "url('images/cloudy.gif')";
                        }

                        document.getElementById("wrapper-description").innerHTML = description;
                        document.getElementById("wrapper-temp").innerHTML = temp + "°C";
                        document.getElementById("wrapper-pressure").innerHTML = pressure;
                        document.getElementById("wrapper-humidity").innerHTML = humidity + "°C";

                        // Weather hourly data
                        let hourNow = Math.round(result.data.hourly[0].temp);
                        let hour1 = Math.round(result.data.hourly[1].temp);
                        let hour2 = Math.round(result.data.hourly[2].temp);
                        let hour3 = Math.round(result.data.hourly[3].temp);
                        let hour4 = Math.round(result.data.hourly[4].temp);
                        let hour5 = Math.round(result.data.hourly[5].temp);

                        document.getElementById("wrapper-hour-now").innerHTML = hourNow + "°C";
                        document.getElementById("wrapper-hour1").innerHTML = hour1 + "°C";
                        document.getElementById("wrapper-hour2").innerHTML = hour2 + "°C";
                        document.getElementById("wrapper-hour3").innerHTML = hour3 + "°C";
                        document.getElementById("wrapper-hour4").innerHTML = hour4 + "°C";
                        document.getElementById("wrapper-hour5").innerHTML = hour5 + "°C";

                        // Time
                        let timeNow = new Date().getHours();
                        let time1 = timeNow + 1;
                        let time2 = time1 + 1;
                        let time3 = time2 + 1;
                        let time4 = time3 + 1;
                        let time5 = time4 + 1;

                        document.getElementById("wrapper-time1").innerHTML = time1;
                        document.getElementById("wrapper-time2").innerHTML = time2;
                        document.getElementById("wrapper-time3").innerHTML = time3;
                        document.getElementById("wrapper-time4").innerHTML = time4;
                        document.getElementById("wrapper-time5").innerHTML = time5;

                        // Weather daily data
                        let tomorrowTemp = Math.round(result.data.daily[0].temp.day);
                        let dATTemp = Math.round(result.data.daily[1].temp.day);

                        document.getElementById("wrapper-forecast-temp-today").innerHTML = temp + "°C";
                        document.getElementById("wrapper-forecast-temp-tomorrow").innerHTML = tomorrowTemp + "°C";
                        document.getElementById("wrapper-forecast-temp-dAT").innerHTML = dATTemp + "°C";

                        // Icons
                        let iconBaseUrl = "http://openweathermap.org/img/wn/";
                        let iconFormat = ".png";

                        // Today
                        let iconCodeToday = result.data.current.weather[0].icon;
                        let iconFullyUrlToday = iconBaseUrl + iconCodeToday + iconFormat;
                        document.getElementById("wrapper-icon-today").src = iconFullyUrlToday;

                        // Tomorrow
                        let iconCodeTomorrow = result.data.daily[0].weather[0].icon;
                        let iconFullyUrlTomorrow = iconBaseUrl + iconCodeTomorrow + iconFormat;
                        document.getElementById("wrapper-icon-tomorrow").src = iconFullyUrlTomorrow;

                        // Day after tomorrow
                        let iconCodeDAT = result.data.daily[1].weather[0].icon;
                        let iconFullyUrlDAT = iconBaseUrl + iconCodeDAT + iconFormat;
                        document.getElementById("wrapper-icon-dAT").src = iconFullyUrlDAT;

                        // Icons hourly

                        // Hour now
                        let iconHourNow = result.data.hourly[0].weather[0].icon;
                        let iconFullyUrlHourNow = iconBaseUrl + iconHourNow + iconFormat;
                        document.getElementById("wrapper-icon-hour-now").src = iconFullyUrlHourNow;

                        // Hour1
                        let iconHour1 = result.data.hourly[1].weather[0].icon;
                        let iconFullyUrlHour1 = iconBaseUrl + iconHour1 + iconFormat;
                        document.getElementById("wrapper-icon-hour1").src = iconFullyUrlHour1;

                        // Hour2
                        let iconHour2 = result.data.hourly[2].weather[0].icon;
                        let iconFullyUrlHour2 = iconBaseUrl + iconHour2 + iconFormat;
                        document.getElementById("wrapper-icon-hour2").src = iconFullyUrlHour1;

                        // Hour3
                        let iconHour3 = result.data.hourly[3].weather[0].icon;
                        let iconFullyUrlHour3 = iconBaseUrl + iconHour3 + iconFormat;
                        document.getElementById("wrapper-icon-hour3").src = iconFullyUrlHour3;

                        // Hour4
                        let iconHour4 = result.data.hourly[4].weather[0].icon;
                        let iconFullyUrlHour4 = iconBaseUrl + iconHour4 + iconFormat;
                        document.getElementById("wrapper-icon-hour4").src = iconFullyUrlHour4;

                        // Hour5
                        let iconHour5 = result.data.hourly[5].weather[0].icon;
                        let iconFullyUrlHour5 = iconBaseUrl + iconHour5 + iconFormat;
                        document.getElementById("wrapper-icon-hour5").src = iconFullyUrlHour5;
                    }
                });
                $.ajax({
                    url: "libs/php/getWikipediaSearch.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        lat: ipLocationLat,
                        lng: ipLocationLng
                    },
                    success: function (result) {
                        console.log(result);
                        var markers = L.markerClusterGroup();
                        $.each(result.data, function (i, item) {
                            markers.addLayer(L.marker([
                                result.data[i].lat,
                                result.data[i].lng
                            ], {icon: wikipediaIcon}).bindPopup(result.data[i].title + "<br> <a href=https://" + result.data[i].wikipediaUrl + ">Wikipedia Link</a>"));
                        });
                        map.addLayer(markers);
                    }
                });

                $.ajax({
                    url: "libs/php/getLocalRestaurants.php",
                    type: "GET",
                    dataType: "json",
                    data: {
                        lat: ipLocationLat,
                        lng: ipLocationLng
                    },
                    success: function (result) {
                        console.log(result);
                        var markers = L.markerClusterGroup();

                        $.each(result.data[0].pois, function (i, item) {
                            marker.addLayer(L.marker([
                                item.coordinates.latitude, item.coordinates.longitude
                            ], {icon: restaurantMarker}).bindPopup(item.name + "<br>" + item.snippet));
                        });
                        map.addLayer(markers);
                    }
                });
                $.ajax({
                    url: "libs/php/getLocalHighlights.php",
                    type: "GET",
                    dataType: "json",
                    data: {
                        lat: ipLocationLat,
                        lng: ipLocationLng
                    },
                    success: function (result) {
                        console.log(result);
                        var markers = L.markerClusterGroup();
                        $.each(result.data[0].pois, function (i, item) {
                            markers.addLayer(L.marker([
                                item.coordinates.latitude, item.coordinates.longitude
                            ], {icon: locationPinIcon}).bindPopup(item.name + "<br>" + item.snippet));
                        });
                        map.addLayer(markers);
                    }
                });
                $.ajax({
                    url: "libs/php/getNearbyPlaces.php",
                    type: "GET",
                    dataType: "json",
                    data: {
                        lat: ipLocationLat,
                        lng: ipLocationLng
                    },
                    success: function (result) {
                        console.log(result);
                    }
                }),
                $.ajax({
                    url: "libs/php/populateCurrencyConverter.php",
                    type: "GET",
                    dataType: "json",
                    success: function (result) {
                        console.log(result.symbols);
                        let currency = result.symbols;
                        for (const property in currency) {
                            $("#currencyIn").append($("<option></option>").text(currency[property]).attr("value", property));
                            $("#currencyOut").append($("<option></option>").text(currency[property]).attr("value", property));
                        }
                    }
                });
            }
        });
    }

    function onLocationFound(e) {
        var radius = e.accuracy;

        L.marker(e.latlng, {icon: userLocationPin}).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
        L.circle(e.latlng, radius).addTo(map);
    }
    map.on("locationfound", onLocationFound);
    map.locate({setView: true, maxZoom: 20});
    let selectField = $("#countrySelect");
    selectField.empty();
    selectField.append('<option selected="true" disabled>Choose Country</option>');
    selectField.prop("selectedIndex", 0);
    $.ajax({
        url: "libs/php/populateSelectFields.php",
        type: "GET",
        dataType: "json",
        success: function (result) {
            let countries = result.data;
            console.log(countries);
            typeof countries;

            countries.sort((a, b) => {
                if (a.name.toString().toLowerCase() < b.name.toString().toLowerCase()) {
                    return -1;
                }
                if (a.name.toString().toLowerCase() > b.name.toString().toLowerCase()) {
                    return 1;
                }
                return 0;
            });
            $.each(countries, function (i, item) {
                selectField.append($("<option></option>").text(countries[i].name).attr("value", countries[i].iso));
            });
        }
    });
});
$("#countrySelect").on("change", function () {
    const chosenValue = this.value;
    let lowerCaseValue = chosenValue.toLowerCase();
    console.log(lowerCaseValue);
    console.log(chosenValue);
    let selectedText = $("#countrySelect :selected").text();
    markers.clearLayers();
    $.ajax({
        url: "libs/php/getCountryBorder.php",
        type: "GET",
        dataType: "json",
        data: {
            countryCode: chosenValue
        },
        success: function (result) {
            console.log(result);
            let border = L.geoJSON(result.data.geometry).addTo(map);
            map.fitBounds(border.getBounds());
        }
    });
    var poiIcon = L.ExtraMarkers.icon({
        extraClasses: "fa-regular",
        icon: "fa-map",
        iconColor: "black",
        shape: "circle",
        prefix: "fa",
        markerColor: "white"
    });
    $.ajax({
        url: "libs/php/getCountryAttractions.php",
        type: "GET",
        dataType: "json",
        data: {
            countryCode: lowerCaseValue
        },
        success: function (result) {
            console.log(result);
            var markers = L.markerClusterGroup();
            $.each(result.data, function (i, item) {
                markers.addLayer(L.marker([
                    result.data[i].coordinates.latitude,
                    result.data[i].coordinates.longitude,
                ], {icon: poiIcon}).bindPopup(result.data[i].name + "<br> <a href=" + result.data[i].attribution[1].url + ">More Info</a>"));
            });
            map.addLayer(markers);
        }
    });

    $.ajax({
        url: "libs/php/getAirports.php",
        type: "GET",
        dataType: "json",
        data: {
            countryCode: chosenValue
        },
        success: function (result) {
            console.log(result);
            var markers = L.markerClusterGroup();
            $.each(result.data, function (i, item) {
                markers.addLayer(L.marker([
                    result.data[i].latitude,
                    result.data[i].longitude
                ], {icon: airportIcon}).bindPopup(result.data[i].name + "<br> <a href=https://" + result.data[i].pop_page + ">Wikipedia Link</a>"));
            });
            map.addLayer(markers);
        }
    });

    $.ajax({
        url: "libs/php/getNews.php",
        type: "GET",
        dataType: "json",
        data: {
            country: selectedText
        },
        success: function (result) {
            console.log(result);
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
        }
    });
    $.ajax({
        url: "libs/php/convertCountryToLatLng.php",
        type: "GET",
        dataType: "json",
        data: {
            country: selectedText
        },
        success: function (result) {
            console.log(result);
            console.log(result.data.results[0].geometry);
            document.getElementById("currentCountryCurrency").innerHTML = "<h4> Current Country Currency: " + result.data.results[0].annotations.currency.name + "</h4>";

            $.ajax({
                url: "libs/php/getCurrentWeatherData.php",
                type: "POST",
                dataType: "json",
                data: {
                    lat: result.data.results[0].geometry.lat,
                    lon: result.data.results[0].geometry.lng
                },
                success: function (result) { // Weather main data
                    document.getElementById("wrapper-name").innerHTML = selectedText;

                    console.log(result);
                    let main = result.data.current.weather[0].main;
                    let description = result.data.current.weather[0].description;
                    let temp = Math.round(result.data.current.temp);
                    let pressure = result.data.current.pressure;
                    let humidity = result.data.current.humidity;
                    if ((result.data.current.weather[0].id = 800)) {
                        document.getElementById("wrapper-bg").style.backgroundImage = "url('images/clear.gif')";
                    } else if (result.data.current.weather[0].id >= 200 && result.data.current.weather[0].id <= 232) {
                        document.getElementById("wrapper-bg").style.backgroundImage = "url('images/thunderstorm.gif')";
                    } else if (result.data.current.weather[0].id >= 300 && result.data.urrent.weather[0].id <= 531) {
                        document.getElementById("wrapper-bg").style.backgroundImage = "url('images/rain.gif')";
                    } else if (result.data.current.weather[0].id >= 600 && result.data.current.weather[0].id <= 622) {
                        document.getElementById("wrapper-bg").style.backgroundImage = "url('images/snow.gif')";
                    } else if (result.data.current.weather[0].id == 701 && result.data.current.weather[0].id == 711 && result.data.current.weather[0].id == 741) {
                        document.getElementById("wrapper-bg").style.backgroundImage = "url('images/fog.gif')";
                    } else if (result.data.current.weather[0].id >= 801 && result.data.current.weather[0].id <= 804) {
                        document.getElementById("wrapper-bg").style.backgroundImage = "url('images/cloudy.gif')";
                    }

                    document.getElementById("wrapper-description").innerHTML = description;
                    document.getElementById("wrapper-temp").innerHTML = temp + "°C";
                    document.getElementById("wrapper-pressure").innerHTML = pressure;
                    document.getElementById("wrapper-humidity").innerHTML = humidity + "°C";

                    // Weather hourly data
                    let hourNow = Math.round(result.data.hourly[0].temp);
                    let hour1 = Math.round(result.data.hourly[1].temp);
                    let hour2 = Math.round(result.data.hourly[2].temp);
                    let hour3 = Math.round(result.data.hourly[3].temp);
                    let hour4 = Math.round(result.data.hourly[4].temp);
                    let hour5 = Math.round(result.data.hourly[5].temp);

                    document.getElementById("wrapper-hour-now").innerHTML = hourNow + "°C";
                    document.getElementById("wrapper-hour1").innerHTML = hour1 + "°C";
                    document.getElementById("wrapper-hour2").innerHTML = hour2 + "°C";
                    document.getElementById("wrapper-hour3").innerHTML = hour3 + "°C";
                    document.getElementById("wrapper-hour4").innerHTML = hour4 + "°C";
                    document.getElementById("wrapper-hour5").innerHTML = hour5 + "°C";

                    // Time
                    let timeNow = new Date().getHours();
                    let time1 = timeNow + 1;
                    let time2 = time1 + 1;
                    let time3 = time2 + 1;
                    let time4 = time3 + 1;
                    let time5 = time4 + 1;

                    document.getElementById("wrapper-time1").innerHTML = time1;
                    document.getElementById("wrapper-time2").innerHTML = time2;
                    document.getElementById("wrapper-time3").innerHTML = time3;
                    document.getElementById("wrapper-time4").innerHTML = time4;
                    document.getElementById("wrapper-time5").innerHTML = time5;

                    // Weather daily data
                    let tomorrowTemp = Math.round(result.data.daily[0].temp.day);
                    let dATTemp = Math.round(result.data.daily[1].temp.day);

                    document.getElementById("wrapper-forecast-temp-today").innerHTML = temp + "°C";
                    document.getElementById("wrapper-forecast-temp-tomorrow").innerHTML = tomorrowTemp + "°C";
                    document.getElementById("wrapper-forecast-temp-dAT").innerHTML = dATTemp + "°C";

                    // Icons
                    let iconBaseUrl = "http://openweathermap.org/img/wn/";
                    let iconFormat = ".png";

                    // Today
                    let iconCodeToday = result.data.current.weather[0].icon;
                    let iconFullyUrlToday = iconBaseUrl + iconCodeToday + iconFormat;
                    document.getElementById("wrapper-icon-today").src = iconFullyUrlToday;

                    // Tomorrow
                    let iconCodeTomorrow = result.data.daily[0].weather[0].icon;
                    let iconFullyUrlTomorrow = iconBaseUrl + iconCodeTomorrow + iconFormat;
                    document.getElementById("wrapper-icon-tomorrow").src = iconFullyUrlTomorrow;

                    // Day after tomorrow
                    let iconCodeDAT = result.data.daily[1].weather[0].icon;
                    let iconFullyUrlDAT = iconBaseUrl + iconCodeDAT + iconFormat;
                    document.getElementById("wrapper-icon-dAT").src = iconFullyUrlDAT;

                    // Icons hourly

                    // Hour now
                    let iconHourNow = result.data.hourly[0].weather[0].icon;
                    let iconFullyUrlHourNow = iconBaseUrl + iconHourNow + iconFormat;
                    document.getElementById("wrapper-icon-hour-now").src = iconFullyUrlHourNow;

                    // Hour1
                    let iconHour1 = result.data.hourly[1].weather[0].icon;
                    let iconFullyUrlHour1 = iconBaseUrl + iconHour1 + iconFormat;
                    document.getElementById("wrapper-icon-hour1").src = iconFullyUrlHour1;

                    // Hour2
                    let iconHour2 = result.data.hourly[2].weather[0].icon;
                    let iconFullyUrlHour2 = iconBaseUrl + iconHour2 + iconFormat;
                    document.getElementById("wrapper-icon-hour2").src = iconFullyUrlHour1;

                    // Hour3
                    let iconHour3 = result.data.hourly[3].weather[0].icon;
                    let iconFullyUrlHour3 = iconBaseUrl + iconHour3 + iconFormat;
                    document.getElementById("wrapper-icon-hour3").src = iconFullyUrlHour3;

                    // Hour4
                    let iconHour4 = result.data.hourly[4].weather[0].icon;
                    let iconFullyUrlHour4 = iconBaseUrl + iconHour4 + iconFormat;
                    document.getElementById("wrapper-icon-hour4").src = iconFullyUrlHour4;

                    // Hour5
                    let iconHour5 = result.data.hourly[5].weather[0].icon;
                    let iconFullyUrlHour5 = iconBaseUrl + iconHour5 + iconFormat;
                    document.getElementById("wrapper-icon-hour5").src = iconFullyUrlHour5;
                }
            });
            $.ajax({
                url: "libs/php/getCountryData.php",
                type: "GET",
                dataType: "json",
                data: {
                    country: chosenValue
                },
                success: function (result) {
                    console.log(result);
                    console.log(result.languages);
                    document.getElementById("countryFlag").innerHTML = result.flag.emoji;
                    document.getElementById("countryName").innerHTML = result.name;
                    document.getElementById("capitalCity").innerHTML = result.capital.name;
                    let objects = Object.values(result.languages);
                    $.each(objects, function (i, item) {
                        document.getElementById("countryLanguages").append(objects[i] + ", ");
                    });
                    document.getElementById("countryPopulation").innerHTML = result.population.toLocaleString("en-US");
                    document.getElementById("countryTimezone").innerHTML = result.timezone.timezone + " Code: " + result.timezone.code;
                    document.getElementById("countryWiki").innerHTML = `<a href=${
                        result.wiki_url
                    }> More Info </a>`;
                    document.getElementById("countryCurrency").innerHTML = result.currency.code;
                }
            });
        }
    });
});

$("#currencyOut").on("change", function () {
    let toCountry = $("#currencyOut :selected").val();
    let fromCountry = $("#currencyIn :selected").val();
    let amount = $("#numberToConvert").val();
    console.log(amount);
    console.log(toCountry);
    console.log(fromCountry);
    $.ajax({
        url: "libs/php/convertCurrency.php",
        type: "GET",
        dataType: "json",
        data: {
            fromCountry: fromCountry,
            toCountry: toCountry,
            amount: amount
        },
        success: function (result) {
            document.getElementById("currencyOutput").innerHTML = `<input type="number" class="form-input" id="convertedAmount" placeholder="${
                result.result
            }" disabled>`;
        }
    });
});
