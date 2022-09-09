$(document).ready(function(){
	$.ajax({
		url: "libs/php/getAll.php",
		type: "GET",
		dataType: "json",
		success: function (result) {
			console.log(result)
			$.each(result.data, function (i, item) {
				$('#tableBody').append(`<tr>
				<td>${result.data[i].firstName}</td>
				<td>${result.data[i].lastName}</td>                        
				<td>${result.data[i].location}</td>
				<td>${result.data[i].department}</td>
				<td>${result.data[i].jobTitle}</td>
				<td>${result.data[i].email}</td>
				<td>

					<a href="#" class="settings" title="Settings" id="settingsBtn" data-bs-toggle="modal" data-bs-target="#updateUserModal"><i class="material-icons">&#xE8B8;</i></a>
					<a href="#" class="delete" title="Delete" ><i class="material-icons">&#xE5C9;</i></a>
				</td>
			</tr>
				`);
				$('#settingsBtn').attr("personnelID", result.data[i].id)
				

				
				$('#updatefName').innerHTML= `<input type="text" class="form-control" id="updatefName" placeholder="${result.data[i].firstName}"></input>`;
				$('#updatelName').innerHTML = result.data[i].lastName;
				$('#updateLocation').val(result.data[i].location).change();
				$('#updateJob').innerHTML = result.data[i].jobTitle;
				$('#updateEmail').innerHTML = result.data[i].email;
			})
			
			
		}
	})
});
$('#settingsBtn').on('click', function(){
	var personnelId = document.getElementById('settingsBtn').getAttribute('testo')
	alert($("#settingsBtn").attr("personnelid"))
	console.log($(this).attr("personnelid"))
	$.ajax({
		url:'libs/php/getPersonnelByID.php',
		type:'GET',
		dataType: 'json',
		data: {
			id: personnelId
		},
		success(result){
			console.log(result)
		}
	})
})

