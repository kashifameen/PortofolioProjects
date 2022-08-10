let map = L.map('map').setView([0.0, 0.0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 16,
attribution: '© OpenStreetMap'
}).addTo(map);
console.log(map.getBounds().getNorth())
console.log(map.getBounds())


L.easyButton( '<span class="star" data-toggle="modal" data-target="#myModal">&starf;</span>', function(){
  $("#myModal").modal("show");
}).addTo(map);
L.easyButton( 'fa-cloud-sun-rain fa-lg', function(){
  $("#weatherModal").modal("show");
}).addTo(map);

$(document).ready(function(){
  console.log("ready")

   if ("geolocation" in navigator){ //check geolocation available
       //try to get user current location using getCurrentPosition() method

       navigator.geolocation.getCurrentPosition(function(position){
        console.log(navigator.geolocation)
               console.log("Found your location <br />Lat : "+position.coords.latitude+" </br>Lang :"+ position.coords.longitude);
                console.log(position)
              map.setView([position.coords.latitude, position.coords.longitude], 13);
              $.ajax({
                url:"libs/php/getOpencageApi.php",
                type:'POST',
                dataType: 'json',
                data: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                },
                success: function(result){
                  console.log(result.data)
                  document.getElementById('country').innerHTML = "<h5>Location: " + result.data.results[0].components.city +", " +result.data.results[0].components.country + " " +result.data.results[0].annotations.flag + "</h5>";
                  document.getElementById('currency').innerHTML="<h5>Currency: "  + result.data.results[0].annotations.currency.name + "<br>" + "Symbol: " 
                  + result.data.results[0].annotations.currency.html_entity+"</h5>"
                  document.getElementById('currentTime').innerHTML="<h5>Current Time: " + new Date().toLocaleString("en-US", {timeZone: result.data.results[0].annotations.timezone.name})
                  var city = result.data.results[0].components.city
                  document.getElementById('wrapper-name').innerHTML = city
                    console.log(city)
                }
              })
              
              $.ajax({
                url:"libs/php/getCurrentWeatherData.php",
                type:'POST',
                dataType:'json',
                data: {
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                },
                success: function(result){
                  // Weather main data
                  let main = result.data.current.weather[0].main;
                  let description = result.data.current.weather[0].description;
                  let temp = Math.round(result.data.current.temp);
                  let pressure = result.data.current.pressure;
                  let humidity = result.data.current.humidity;
                  if(result.data.current.weather[0].id = 800){
                    document.getElementById('wrapper-bg').style.backgroundImage="url('images/clear.gif')"
                  } else if (result.data.current.weather[0].id >= 200 && result.data.current.weather[0].id <= 232){
                    document.getElementById('wrapper-bg').style.backgroundImage="url('images/thunderstorm.gif')"
                  } else if (result.data.current.weather[0].id >= 300 && result.data.urrent.weather[0].id <= 531){
                    document.getElementById('wrapper-bg').style.backgroundImage="url('images/rain.gif')"

                  } else if(result.data.current.weather[0].id >= 600 && result.data.current.weather[0].id <= 622){
                    document.getElementById('wrapper-bg').style.backgroundImage="url('images/snow.gif')"

                  } else if(result.data.current.weather[0].id == 701 && result.data.current.weather[0].id == 711 && result.data.current.weather[0].id == 741){
                    document.getElementById('wrapper-bg').style.backgroundImage="url('images/fog.gif')"

                  } else if(result.data.current.weather[0].id >=801 && result.data.current.weather[0].id <= 804){
                    document.getElementById('wrapper-bg').style.backgroundImage="url('images/cloudy.gif')"

                  }
                                    

                  document.getElementById("wrapper-description").innerHTML = description;
                  document.getElementById("wrapper-temp").innerHTML = temp + "°C";
                  document.getElementById("wrapper-pressure").innerHTML = pressure;
                  document.getElementById("wrapper-humidity").innerHTML = humidity + "°C";
                  document.getElementById("wrapper-name").innerHTML = name;

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
                 

                  document.getElementById("wrapper-forecast-temp-today").innerHTML =
                  temp + "°C";
                  document.getElementById("wrapper-forecast-temp-tomorrow").innerHTML =
                  tomorrowTemp + "°C";
                  document.getElementById("wrapper-forecast-temp-dAT").innerHTML =
                  dATTemp + "°C";

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
                  document.getElementById(
                  "wrapper-icon-tomorrow"
                  ).src = iconFullyUrlTomorrow;

                  // Day after tomorrow
                  let iconCodeDAT = result.data.daily[1].weather[0].icon;
                  let iconFullyUrlDAT = iconBaseUrl + iconCodeDAT + iconFormat;
                  document.getElementById("wrapper-icon-dAT").src = iconFullyUrlDAT;

                  // Icons hourly

                  // Hour now
                  let iconHourNow = result.data.hourly[0].weather[0].icon;
                  let iconFullyUrlHourNow = iconBaseUrl + iconHourNow + iconFormat;
                  document.getElementById(
                  "wrapper-icon-hour-now"
                  ).src = iconFullyUrlHourNow;

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

              })
              $.ajax({
                url:"libs/php/getWikipediaSearch.php",
                type: 'POST',
                dataType:'json',
                data: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
                  success: function(result){
                    console.log(result)
                    L.marker([result.data[0].lat, result.data[0].lng]).addTo(map).bindPopup(result.data[0].title +"<br> <a href=https://" + result.data[0].wikipediaUrl + ">Wikipedia Link</a>");
                    L.marker([result.data[1].lat, result.data[1].lng]).addTo(map).bindPopup(result.data[1].title +"<br> <a href=https://" + result.data[1].wikipediaUrl + ">Wikipedia Link</a>");
                    L.marker([result.data[2].lat, result.data[2].lng]).addTo(map).bindPopup(result.data[2].title +"<br> <a href=https://" + result.data[2].wikipediaUrl + ">Wikipedia Link</a>");
                    L.marker([result.data[3].lat, result.data[3].lng]).addTo(map).bindPopup(result.data[3].title +"<br> <a href=https://" + result.data[3].wikipediaUrl + ">Wikipedia Link</a>");
                    L.marker([result.data[4].lat, result.data[4].lng]).addTo(map).bindPopup(result.data[4].title +"<br> <a href=https://" + result.data[4].wikipediaUrl + ">Wikipedia Link</a>");

                  }
              })
              $.ajax({
                url:"libs/php/getLocalHighlights.php",
                type: 'GET',
                dataType: 'json',
                data:{
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
                success: function(result){
                  console.log(result.data)
                  $.each(result.data[0].pois, function(i, item){
              
                    L.marker([item.coordinates.latitude, item.coordinates.longitude]).addTo(map).bindPopup(item.name +"<br>" + item.snippet);
          
                  })
                }
              })
              $.ajax({
                url:"libs/php/getIpGeoLocation.php",
                type:'GET',
                dataType: 'json',
               success: function(result){
                 console.log(result.city.population)
                 document.getElementById('population').innerHTML="<h5>Population: " + result.city.population + "</h5>"

               }
              })

           });
           



   }else{

       console.log("Browser doesn't support geolocation!");

   }
let selectField = $('#select');
selectField.empty();
selectField.append('<option selected="true" disabled>Choose Country</option>')
selectField.prop('selectedIndex', 0);
   $.ajax({
     url:"libs/php/populateSelectFields.php",
     type:'GET',
     dataType: 'json',
     success: function(result) {
      // console.log(result.data)
      let countries = result.data;
      console.log(countries)
      typeof countries;

      countries.sort((a, b) => {
        if(a.name.toString().toLowerCase() < b.name.toString().toLowerCase()){
          return -1;
        }
        if(a.name.toString().toLowerCase() > b.name.toString().toLowerCase()){
          return 1;
        }
        return 0;

      });
      $.each(countries, function(i, item){     
        selectField.append($('<option></option>').text(countries[i].name).attr('value', countries[i].iso))
      })
        
     } 
   })
})



function onLocationFound(e) {

   var radius = e.accuracy;
   L.marker(e.latlng).addTo(map)
    .bindPopup("You are within " + radius + " meters from this point").openPopup();
   L.circle(e.latlng, radius).addTo(map);

}
map.on('locationfound', onLocationFound);
map.locate({setView: true, maxZoom: 20});

$('select').on('change', function() {
  const chosenValue = this.value;
  console.log(chosenValue)
$.ajax({
  url:"libs/php/getCountryBorder.php",
  type:'GET',
  dataType: 'json',
  success: function(result) {
    $.each(result.data, function(i, item){
        if(item.features.properties.iso_a2 == chosenValue){
          let border = L.geoJSON(item.features.geometry).addTo(map)
          map.fitBounds(border.getBounds());
        }

    })      
  }
})

$.ajax({
  url:"libs/php/getAirports.php",
  type:'GET',
  dataType: 'json',
  data: {
    countryCode: chosenValue,
  },
  success: function(result){
    console.log(result)
    let airportIcon = L.divIcon({
      html:'<i class="fa-solid fa-plane-departure"></i>',
      iconSize: [10, 10],
      className:'myDivIcon'

    })
    $.each(result.data, function(i, item){
      L.marker([result.data[i].latitude, result.data[i].longitude],{icon: airportIcon}).addTo(map).bindPopup(result.data[i].name +"<br> <a href=https://" + result.data[i].wikipedia_page + ">Wikipedia Link</a>");

    })
  }
})
})