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

					<a href="#" class="settings" title="Settings" data-bs-toggle="modal" data-bs-target="#updateUserModal" data-personnelId=${result.data[i].id} ><i class="material-icons">&#xE8B8;</i></a>
					<a href="#" class="delete" title="Delete" ><i class="material-icons">&#xE5C9;</i></a>
				</td>
			</tr>
				`)	
				// document.getElementById('updatefName').value= result.data[i].firstName
				// document.getElementById('updatelName').value = result.data[i].lastName;
				// document.getElementById('updateLocation').value = result.data[i].location;
				// document.getElementById('updateJob').value = result.data[i].jobTitle;
				// document.getElementById('updateEmail').value = result.data[i].email;
				// $('#updatelName').value = result.data[i].lastName;
				// $('#updateLocation').val(result.data[i].location);
				// $('#updateJob').val = result.data[i].jobTitle;
				// $('#updateEmail').val = result.data[i].email;
			})
			
			
		}
	})
});

$(".settings").on("click", function(){
	console.log('This Works!')
	alert($(this).attr("data-personnelid"))
	
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

