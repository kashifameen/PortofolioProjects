window.addEventListener('load', function () {
    document.querySelector('body').classList.add("loaded")
});

$(document).ready(function () {
    getAllPersonnel().done((result) => {
        console.log(result)
        $.each(result.data, function (i, item) {
            $('#tableBody').append(`<tr>
				<td>${
                result.data[i].firstName
            }</td>
				<td>${
                result.data[i].lastName
            }</td>                        
				<td class="d-none d-sm-table-cell d-md-table-cell d-lg-table-cell d-xl-table-cell d-xxl-table-cell">${
                result.data[i].location
            }</td>
				<td class="d-none d-xs-none d-sm-table-cell d-md-table-cell d-lg-table-cell d-xl-table-cell d-xxl-table-cell">${
                result.data[i].department
            }</td>
				<td class="d-none d-md-table-cell d-lg-table-cell d-xl-table-cell d-xxl-table-cell">${
                result.data[i].jobTitle
            }</td>
				<td class="d-none d-md-table-cell d-lg-table-cell d-xl-table-cell d-xxl-table-cell">${
                result.data[i].email
            }</td>
				<td>

					<a href="#" class="settings" title="Settings" data-bs-toggle="modal" data-bs-target="#updateUserModal" id="button" data-personnelId=${
                result.data[i].id
            } ><i class="fa-solid fa-gears"></i></a>
					<a href="#" class="delete" title="Delete" data-personnelId=${
                result.data[i].id
            } ><i class="fa-solid fa-user-xmark"></i></a>
				</td>
			</tr>
				`)
        })
        $(".delete").on("click", function () {
            deleteButton(this)
        })
        $(".settings").on("click", function () {
            settingsButton(this)
        })
        $(".delete locationDelete").on("click", function () {
            deleteLocationButton(this)
            console.log('TESt this')
        })

    })
    $('#department-tab').on("click", function () {
        $('#departmentTableBody').empty()
        getAllDepartments().done((result) => {
            $.each(result.data, function (i, item) {
                $('#departmentTableBody').append(`<tr>
                    <td>${
                    result.data[i].name
                }</td>               
                   <td>
    
                        <a href="#" class="departmentSettings settings" title="Settings" data-bs-toggle="modal" data-bs-target="#updateDepartmentTabModal" id="button" data-departmentId=${
                    result.data[i].id
                } ><i class="fa-solid fa-gears"></i></a>
                        <a href="#" class="departmentDelete delete" title="Delete" data-departmentId=${
                    result.data[i].id
                } ><i class="fa-solid fa-user-xmark"></i></a>
                    </td>
                </tr>
                    `)
            })
            $('.departmentDelete').on("click", function () {
                deleteDepartmentButton(this)
            })
            $('.departmentSettings').on("click", function () {
                let departmentId = $(this).attr("data-departmentId")
                console.log(departmentId)
                $('#updateDepartmentButtonTab').on("click", function () {
                    updateDepartmentButton(departmentId)
                })


            })
        })
    })
    $('#location-tab').on("click", function () {
        $('#locationTableBody').empty()
        getAllLocation().done((result) => {
            console.log(result)
            $.each(result.data, function (i, item) {
                $('#locationTableBody').append(`<tr>
                    <td>${
                    result.data[i].name
                }</td>               
                   <td class=text-right>
    
                        <a href="#" class="settings locationSettings" title="Settings" data-bs-toggle="modal" data-bs-target="#updateLocationModal" id="button" data-locationId=${
                    result.data[i].id
                } ><i class="fa-solid fa-gears"></i></a>
                        <a href="#" class="delete locationDelete" title="Delete" data-locationId=${
                    result.data[i].id
                } ><i class="fa-solid fa-user-xmark"></i></a>
                    </td>
                </tr>
                    `)
            })
            $('.locationDelete').on("click", function () {
                deleteLocationButton(this)
            })
            $('.locationSettings').on("click", function () {
                let locationId = $(this).attr("data-locationId")
                $('#updateLocationButtonTab').on("click", function () {
                    updateLocationButton(locationId)

                })
            })
        })
    })
    $('#updateUserBtn').on("click", function () {

        let updateFirstName = document.getElementById('updatefName').value;
        let updateLastName = document.getElementById('updatelName').value;
        let updateJob = document.getElementById('updateJob').value;
        let updateEmail = document.getElementById('updateEmail').value;
        let updateDepartment = document.getElementById('updateDepartment').value;
        let personnelId = document.getElementById('personnelId').value;
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
                console.log(result)
                document.getElementById('updateUserModalBody').innerHTML = `<h5>${updateFirstName}'s profile has been updated. </h5>`

            }
        })
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
    $('#locationForm').on("change", function () {
        const chosenValue = this.value;
        console.log(chosenValue)
        $('#tableBody').empty()
        getAllPersonnel().done((result) => {
            result.data.forEach(element => {
                if (element.locationId == chosenValue) {
                    $('#tableBody').append(`<tr>
                    <td>${
                        element.firstName
                    }</td>
                    <td>${
                        element.lastName
                    }</td>                        
                    <td class="d-none d-sm-table-cell d-md-table-cell d-lg-table-cell d-xl-table-cell d-xxl-table-cell">${
                        element.location
                    }</td>
                    <td class="d-none d-xs-none d-sm-table-cell d-md-table-cell d-lg-table-cell d-xl-table-cell d-xxl-table-cell">${
                        element.department
                    }</td>
                    <td class="d-none d-md-table-cell d-lg-table-cell d-xl-table-cell d-xxl-table-cell">${
                        element.jobTitle
                    }</td>
                    <td class="d-none d-md-table-cell d-lg-table-cell d-xl-table-cell d-xxl-table-cell"> ${
                        element.email
                    }</td>
                    <td >
    
                        <a href="#" class="settings" title="Settings" data-bs-toggle="modal" data-bs-target="#updateUserModal" id="button" data-personnelId=${
                        element.id
                    } ><i class="fa-solid fa-gears"></i></a>
                        <a href="#" class="delete" title="Delete" data-personnelId=${
                        element.id
                    } ><i class="fa-solid fa-user-xmark"></i></a>
                    </td>
                </tr>
                    `)
                }
            })
            $(".delete").on("click", function () {
                deleteButton(this)
            })
            $(".settings").on("click", function () {
                settingsButton(this)
            })


        })


    })
    $('#departmentHeader').on("click", function () {
        console.log('Header Clicked')
        $('#tableBody').empty()
        getAllDepartments().done((result) => {
            console.log(result)
        })
    })
    $('#departmentForm').on("change", function () {
        const chosenValue = this.value;
        console.log(chosenValue)
        $('#tableBody').empty()
        getAllPersonnel().done((result) => {
            result.data.forEach(element => {
                if (element.departmentID == chosenValue) {
                    $('#tableBody').append(`<tr>
                    <td>${
                        element.firstName
                    }</td>
                    <td>${
                        element.lastName
                    }</td>                        
                    <td class="d-none d-sm-table-cell d-md-table-cell d-lg-table-cell d-xl-table-cell d-xxl-table-cell">${
                        element.location
                    }</td>
                    <td class="d-none d-xs-none d-sm-table-cell d-md-table-cell d-lg-table-cell d-xl-table-cell d-xxl-table-cell">${
                        element.department
                    }</td>
                    <td class="d-none d-md-table-cell d-lg-table-cell d-xl-table-cell d-xxl-table-cell" >${
                        element.jobTitle
                    }</td>
                    <td class="d-none d-md-table-cell d-lg-table-cell d-xl-table-cell d-xxl-table-cell">${
                        element.email
                    }</td>
                    <td>
                        <a href="#" class="settings" title="Settings" data-bs-toggle="modal" data-bs-target="#updateUserModal" id="button" data-personnelId=${
                        element.id
                    } ><i class="fa-solid fa-gears"></i></a>
                        <a href="#" class="delete" title="Delete" data-personnelId=${
                        element.id
                    } ><i class="fa-solid fa-user-xmark"></i></a>
                    </td>
                </tr>
                    `)
                }
            })
            $(".delete").on("click", function () {
                deleteButton(this)
            })
            $(".settings").on("click", function () {
                settingsButton(this)
                console.log('Working')
            })
        })

    })
    var departmentDropdown = document.getElementById('departmentForm');
    var updateDepartment = document.getElementById('updateDepartment')
    var addDepartment = document.getElementById('addDepartment')
    getAllDepartments().done((result) => {
        result.data.forEach(element => {
            let opt = document.createElement('option');
            let opt2 = document.createElement('option')
            let opt3 = document.createElement('option')
            opt.value = element.id
            opt.textContent = element.name
            opt2.value = element.id
            opt2.textContent = element.name
            opt3.value = element.id
            opt3.textContent = element.name
            departmentDropdown.appendChild(opt)
            updateDepartment.appendChild(opt2)
            addDepartment.appendChild(opt3)
        })
    })
    var locationDropdown = document.getElementById('locationForm');
    var deleteLocation = document.getElementById('deleteLocation')
    getAllLocation().done((result) => {
        result.data.forEach(element => {
            let opt = document.createElement('option');
            let opt2 = document.createElement('option')
            let opt3 = document.createElement('option');
            opt.value = element.id
            opt.textContent = element.name
            opt2.value = element.id
            opt2.textContent = element.name
            opt3.value = element.id
            opt3.textContent = element.name
            locationDropdown.appendChild(opt)
            deleteLocation.appendChild(opt3)

        })
    })
    $('#addDepartmentBtn').on("click", function () {
        console.log('Button Clicked')
        var locationSelect = document.getElementById('addDepartmentLocation');
        console.log(locationSelect)
        getAllLocation().done((result) => {
            result.data.forEach(element => {
                let opt = document.createElement('option');
                opt.value = element.id
                opt.textContent = element.name
                locationSelect.appendChild(opt)
            })
        })

    })

    $('#submitNewDepartmentBtn').on("click", function () {
        let addNewDepartment = document.getElementById('addNewDepartment').value;
        let addDepartmentLocation = document.getElementById('addDepartmentLocation').value;
        $.ajax({
            url: "libs/php/insertDepartment.php",
            type: "POST",
            dataType: "json",
            data: {
                name: addNewDepartment,
                locationID: addDepartmentLocation
            },
            success: function (result) {
                console.log(result)
                console.log("submited")
                document.getElementById('addDepartmentModalBody').innerHTML = `<h5> ${addNewDepartment} added to departments </h5>`

            }
        })
    })
    $('#deleteDepartmentBtn').on("click", function () {
        let deleteDepartmentDropdown = document.getElementById('deleteDepartmentLocation');
        getAllDepartments().done((result) => {
            console.log(result)
            result.data.forEach(element => {
                let opt = document.createElement('option');
                opt.value = element.id
                opt.textContent = element.name
                deleteDepartmentDropdown.appendChild(opt)

            })
        })
    })
    $('#deleteDepartmentButton').on("click", function () {
        let departmentDropdownValue = document.getElementById('deleteDepartmentLocation').value;
        var departmentName = $('#deleteDepartmentLocation option:selected').text()
        console.log(departmentName)
        console.log(departmentDropdownValue)
        $.ajax({
            url: "libs/php/deleteDepartmentByID.php",
            type: "GET",
            dataType: "json",
            data: {
                departmentID: departmentDropdownValue,
                id: departmentDropdownValue
            },
            success: function (result) {
                console.log(result)
                console.log('Success')

                if (result.status.code === "200") {
                    document.getElementById('deleteDepartmentModalBody').innerHTML = `<h5>${departmentName} has been deleted from departments.</h5>`
                } else if (result.status.code === "400") {
                    document.getElementById('deleteDepartmentModalBody').innerHTML = `<h5>Cannot delete department as it is linked to a personnel</h5>`
                }
            }
        })
    })
    $('#addLocationButton').on("click", function () {
        let addNewLocation = document.getElementById('addNewLocation').value;
        console.log(addNewLocation)
        $.ajax({
            url: "libs/php/insertLocation.php",
            type: "POST",
            dataType: "json",
            data: {
                name: addNewLocation
            },
            success: function (result) {
                console.log('Location Added')
                document.getElementById('addLocationModalBody').innerHTML = `<h5>${addNewLocation} added as a new location.</h5>`
            }
        })
    })
    $('#deleteLocationButton').on("click", function () {
        let deletedLocationId = document.getElementById('deleteLocation').value;
        var deletedLocationName = $('#deleteLocation option:selected').text()

        console.log(deletedLocationId)
        $.ajax({
            url: "libs/php/deleteLocationByID.php",
            type: "POST",
            dataType: "json",
            data: {
                locationID: deletedLocationId,
                id: deletedLocationId
            },
            success: function (result) {
                console.log(result)

                if (result.status.code == "200") {
                    document.getElementById('deleteLocationModalBody').innerHTML = `<h5> ${deletedLocationName} has been deleted from locations</h5>`
                } else if (result.status.code = "400") {
                    document.getElementById('deleteLocationModalBody').innerHTML = `<h5> Cannot delete location which is linked to a department.</h5>`

                }
            }
        })
    })

})


const getAllPersonnel = () => {
    return $.ajax({url: "libs/php/getAll.php", type: "GET", dataType: "json"});

}
const getAllLocation = () => {
    return $.ajax({url: "libs/php/getAllLocation.php", type: "GET", dataType: "json"})
}

const getAllDepartments = () => {
    return $.ajax({url: "libs/php/getAllDepartments.php", type: "GET", dataType: "json"})
}
// delete button when you are viewing locations in the locations tab
const deleteLocationButton = (el) => {
    let locationId = $(el).attr("data-locationId")
    console.log(locationId)
    $(el).closest("td").css({"color": "red"})
    console.log('delete Location tab button workin')
    $.ajax({
        url: "libs/php/deleteLocationByID.php",
        type: "GET",
        dataType: "json",
        data: {
            locationID: locationId,
            id: locationId
        },
        success: function (result) {
            console.log(result)
            $(el).closest("td").text('Location Deleted')
        }
    })

}
const deleteDepartmentButton = (el) => {
    let departmentId = $(el).attr("data-departmentId")
    console.log(departmentId)

    $(el).closest("td").css({"color": "red"})
    $.ajax({
        url: "libs/php/deleteDepartmentById.php",
        type: "POST",
        dataType: "json",
        data: {
            departmentID: departmentId,
            id: departmentId

        },
        success: function (result) {
            if (result.status.code == "200") {
               $('#departmentDeleteToast').toast('show')

                $(el).closest("td").text('Department Deleted')
            } else if (result.status.code = "400") {
                alert("Cannot delete department which is linked to a location.")
            }
        }
    })
}
const updateLocationButton = (locationId) => {
    let updatedLocationValue = document.getElementById('updateLocationTab').value;
    console.log(updatedLocationValue)
    console.log(locationId)
    $.ajax({
        url: "libs/php/updateLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            name: updatedLocationValue,
            id: locationId
        },
        success: function (result) {
            console.log(result)
            document.getElementById('updateLocationModalBody').innerHTML = `<h5> Location has been updated to ${updatedLocationValue}</h5>`
        }
    })
}
var today = new Date()
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

console.log(time)
const updateDepartmentButton = (departmentId) => {
    let updatedDepartmentValue = document.getElementById('updateDepartmentTab').value;
    console.log(updatedDepartmentValue);
    console.log(departmentId);
    console.log('Button Clicked')
    $.ajax({
        url: "libs/php/updateDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            name: updatedDepartmentValue,
            id: departmentId
        },
        success: function (result) {
            console.log(result)
            // $('#updateDepartmentTabModal').modal('toggle');
            $('#updateDepartmentTabModal').modal('hide');
            document.getElementById('updateDepartmentToastBody').innerText = `Department has been updated to ${updatedDepartmentValue}`
            $('#departmentUpdateToast').toast('show')

        }
    })
}
const deleteButton = (el) => {
    let personnelId = $(el).attr("data-personnelId")

    console.log(personnelId);
    $(el).closest("td").css({"color": "red"})

    console.log('working')
    $.ajax({
        url: "libs/php/deletePersonnel.php",
        type: "POST",
        dataType: "json",
        data: {
            id: personnelId
        },
        success: function (result) {
            console.log(result)
            $(el).closest("td").text(`${
                result.data.firstName
            } ${
                result.data.lastName
            } has been deleted`)

        }
    })
}

const settingsButton = (el) => {
    let personnelId = $(el).attr("data-personnelId")
    document.getElementById('personnelId').value = personnelId;
    console.log(personnelId)
    getAllPersonnel().done((result) => {
        result.data.forEach(element => {
            if (element.id == personnelId) {
                document.getElementById('updatefName').value = element.firstName
                document.getElementById('updatelName').value = element.lastName;
                document.getElementById('updateJob').value = element.jobTitle;
                document.getElementById('updateEmail').value = element.email;
                document.getElementById('updateDepartment').value = element.departmentID
            }
        })

    })

}
