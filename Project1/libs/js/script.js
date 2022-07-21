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
            });
	}else{
		console.log("Browser doesn't support geolocation!");
	}
//     let map = L.map('map').setView([51.505, -0.09], 13);
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '© OpenStreetMap'
// }).addTo(map);
})