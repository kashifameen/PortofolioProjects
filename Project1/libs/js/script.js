$(document).ready(function(){
    console.log("ready")
    if ("geolocation" in navigator){ //check geolocation available 
		//try to get user current location using getCurrentPosition() method
		navigator.geolocation.getCurrentPosition(function(position){ 
				console.log("Found your location <br />Lat : "+position.coords.latitude+" </br>Lang :"+ position.coords.longitude);
                let map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);
                L.easyButton( '<span class="star">&starf;</span>', function(){
                alert('you just clicked the html entity \&starf;');
              }).addTo(map);
            });



	}else{
		console.log("Browser doesn't support geolocation!");
	}
  
  
})

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);

	map.locate({setView: true, maxZoom: 16});