let map = L.map('map').setView([0.0, 0.0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

maxZoom: 19,

attribution: '© OpenStreetMap'

}).addTo(map);



L.easyButton( '<span class="star">&starf;</span>', function(){

alert('you just clicked the html entity \&starf;');

}).addTo(map);



$(document).ready(function(){

   console.log("ready")

   if ("geolocation" in navigator){ //check geolocation available

       //try to get user current location using getCurrentPosition() method

       navigator.geolocation.getCurrentPosition(function(position){

               console.log("Found your location <br />Lat : "+position.coords.latitude+" </br>Lang :"+ position.coords.longitude);

              map.setView([position.coords.latitude, position.coords.longitude], 13);

           });




   }else{

       console.log("Browser doesn't support geolocation!");

   }
let selectField = $('#select');
selectField.empty();
selectField.append('<option selected="true" disabled>Choose Country</option>')
selectField.prop('selectedIndex', 0);
   $.ajax({
     url:"libs/json/countryBorders.geo.json",
     type:'GET',
     dataType: 'json',
     success: function(result) {
       $.each(result.features, function(i, item){
         selectField.append($('<option></option>').text(result.features[i].properties.name).attr(item, result.features[i].properties.iso_a2))
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
map.locate({setView: true, maxZoom: 16});