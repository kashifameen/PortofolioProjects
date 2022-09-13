$(document).ready(function () {
    $.ajax({
        url: "libs/php/getAll.php",
        type: "GET",
        dataType: "json",
        success: function (result) {
            console.log(result)
            $.each(result.data, function (i, item) {
                $('#tableBody').append(`<tr>
				<td>${
                    result.data[i].firstName
                }</td>
				<td>${
                    result.data[i].lastName
                }</td>                        
				<td>${
                    result.data[i].location
                }</td>
				<td>${
                    result.data[i].department
                }</td>
				<td>${
                    result.data[i].jobTitle
                }</td>
				<td>${
                    result.data[i].email
                }</td>
				<td>

					<a href="#" class="settings" title="Settings" data-bs-toggle="modal" data-bs-target="#updateUserModal" id="button" data-personnelId=${
                    result.data[i].id
                } ><i class="material-icons">&#xE8B8;</i></a>
					<a href="#" class="delete" title="Delete" data-personnelId=${
                    result.data[i].id
                } ><i class="material-icons">&#xE5C9;</i></a>
				</td>
			</tr>
				`)
            })
            $(".settings").on("click", function () {
                let personnelId = $(this).attr("data-personnelId")
                result.data.forEach(element => {
                    if (element.id == personnelId) {
                        console.log(element)
                        document.getElementById('updatefName').value = element.firstName
                        document.getElementById('updatelName').value = element.lastName;
                        // document.getElementById('updateLocation').value = element.location;
                        document.getElementById('updateJob').value = element.jobTitle;
                        document.getElementById('updateEmail').value = element.email;
                        document.getElementById('updateDepartment').value = element.department

                    }

                })
                $('#updateUserBtn').on("click", function () {
                    let updateFirstName = document.getElementById('updatefName').value;
                    let updateLastName = document.getElementById('updatelName').value;
                    let updateJob = document.getElementById('updateJob').value;
                    let updateEmail = document.getElementById('updateEmail').value;
                    let updateDepartment = document.getElementById('updateDepartment').value;
                    console.log(personnelId)
                    $.ajax({
                        url: "libs/php/updatePersonnel.php",
                        type: "POST",
                        dataType: 'json',
                        data: {
                            firstName: updateFirstName,
                            lastName: updateLastName,
                            jobTitle: updateJob,
                            email: updateEmail,
                            departmentID: updateDepartment,
                            id: personnelId
                        },
                        success: function (result) {
                            console.log(updateFirstName)
                            document.getElementById('updateUserModalBody').innerHTML = `<h5>${updateFirstName}'s profile has been updated. </h5>`

                        }
                    })
                })
            })

            $(".delete").on("click", function () {
                let personnelId = $(this).attr("data-personnelId")
                console.log(personnelId)
                $.ajax({
                    url: "libs/php/deletePersonnel.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        id: personnelId
                    },
                    success: function (result) {
                        console.log(result)
                    }
                })
            })
        }
    })
    $("#addUserBtn").on("click", function () {
        console.log('Testing!')
        let addFirstName = document.getElementById('addFirstName').value;
        let addLastName = document.getElementById('addLastName').value;
        let addJob = document.getElementById('addJob').value;
        let addEmail = document.getElementById('addEmail').value;
        let addDepartment = document.getElementById('addDepartment').value;
        $.ajax({
            url: "libs/php/insertPersonnel.php",
            type: "POST",
            dataType: 'json',
            data: {
                firstName: addFirstName,
                lastName: addLastName,
                jobTitle: addJob,
                email: addEmail,
                departmentID: addDepartment
            },
            success: function (result) {
                console.log('New User Added')
                document.getElementById('addUserModalBody').innerHTML = `<h5>${addFirstName} ${addLastName} added to database </h5>`

            }
        })
    })
})
