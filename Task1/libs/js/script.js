$('#btnSubmit').click(function() {
    
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
                $('#listOfEarthquakes').html(result['data'][0]);
            }
        }
    })
    let str = $('#north').val()
    
    let str1 = $('#south').val()
    let str2 = $('#west').val()
    let str3 = $('#east').val()
    alert(result['data'])
})

