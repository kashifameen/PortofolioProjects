let map = L.map('map').setView([0.0, 0.0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 18,
attribution: '© OpenStreetMap'
}).addTo(map);
console.log(map.getBounds().getNorth())
console.log(map.getBounds())


L.easyButton( '<span class="star" data-toggle="modal" data-target="#myModal">&starf;</span>', function(){
  $("#myModal").modal("show");
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
                }
              })
              console.log(position.coords.longitude)
              $.ajax({
                url:"libs/php/getCurrentWeatherData.php",
                type:'POST',
                dataType:'json',
                data: {
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                },
                success: function(result){
                  console.log(result)
                  document.getElementById('weatherDescription').innerHTML = "<h5>Current Weather: " + result.data.weather[0].description + "</h5>"
                  document.getElementById('currentTemp').innerHTML = "<h5>Current Temperature: " + result.data.main.temp +"°C"+"</h5>";
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
      console.log(result.data)
    
       $.each(result.data, function(i, item){
         selectField.append($('<option></option>').text(result.data[i].name).attr('value', result.data[i].iso))
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
$.ajax({
  url:"libs/php/getCountryBorder.php",
  type:'GET',
  dataType: 'json',
  success: function(result) {
    console.log(result.data)
    $.each(result.data, function(i, item){
    // console.log(item.features.properties)
        if(item.features.properties.iso_a2 == chosenValue){
          console.log(item)
     
        console.log(item.features)
          L.geoJSON(item.features.geometry).addTo(map)

      
    }
     

    })      
  
  }
})
})