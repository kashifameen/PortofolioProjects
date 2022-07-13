$('#earthquakeBtn').click(function() {
    
    $.ajax({
        url: "libs/php/getEarthquakes.php",
        type: 'POST',
        dataType: 'json',
        data: {
            north: $('#north').val(),
            south: $('#south').val(),
            east: $('#east').val(),
            west: $('#west').val(),     
        },
        
        success: function(result) {
            
            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                $('#listOfEarthquakes').html(result['data'][0]['datetime']);
                $('#earthquakeMagnitude').html(result['data'][0]['magnitude']);
            }
        }
    })
})
$('#oceanBtn').click(function() {
    
    $.ajax({
        url: "libs/php/getOceans.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#latitude').val(),
            lng: $('#longitude').val(),     
        },
        
        success: function(result) {
            
            console.log(JSON.stringify(result));
               if (result.data.status.value == 15) {
                   $('#ocean').html(result.data.status.message)
               }
             else if (result.status.name == "ok") {
                $('#nameOfOcean').html(result['data']['ocean']['name']);
                console.log(result['data']['ocean'])
                $('#geonameId').html(result['data']['ocean']['geonameId']);
            }
           
            
        }
    })
})
$('#wikiBtn').click(function() {
    
    $.ajax({
        url: "libs/php/getWikipediaSearch.php",
        type: 'POST',
        dataType: 'json',
        data: {
            q: $('#placename').val(),     
        },
        
        success: function(result) {
            console.log(JSON.stringify(result));
            console.log()
             if (result.status.name == "ok") {
                $('#placenameEntered').html(result['data'][0]['title']);
                $('#summary').html(result['data'][0]['summary']);
                $('#wikiUrl').attr("href", result['data'][0]['wikipediaUrl'])
            }
           
            
        }
        
    })
})

