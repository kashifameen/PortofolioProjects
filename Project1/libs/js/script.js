let map = L.map('map').setView([0.0, 0.0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 100,
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
        //   var geojsonFeature = {
        //     "type": item.features.type,
        //     "properties": item.features.properties,
        //     "geometry": item.features.geometry
        // };

        console.log(item.features.geometry)
          L.geoJSON(item.features.geometry).addTo(map);

      
    }
     

    })      
   
  }
})
})