window.addEventListener('load', function () {
    document.querySelector('body').classList.add("loaded")
});

$(document).ready(function () {
    populatePersonnel()
    $('#department-tab').on("click", function () {
        $('#departmentTableBody').empty()
        populateDepartmentTab()
        
    })
    $('#location-tab').on("click", function () {
        $('#locationTableBody').empty()
        populateLocationTab()
    })
    
    $('.nav-tabs li').click(function() {
           
        $(this).siblings('li').removeClass('active');
        $(this).addClass('active');
     


    });
   
   
    $('#addUserForm').on("submit", function(e){
        console.log('User Form Submitted')
        e.preventDefault();
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
                $('#tableBody').empty()
                $('#addUserModal').modal('hide')
                $('#personnelAddedToast').toast('show')
                document.getElementById('addPersonnelToastBody').innerHTML = `${addFirstName} ${addLastName} added to database `
                populatePersonnel()


            }
        }) 
    })
   
    $('#updateUserForm').on("submit", function(e){
        e.preventDefault()
        let updateFirstName = document.getElementById('updatefName').value;
        let updateLastName = document.getElementById('updatelName').value;
        let updateJob = document.getElementById('updateJob').value;
        let updateEmail = document.getElementById('updateEmail').value;
        let updateDepartment = document.getElementById('updateDepartmentPersonnel').value;
        let personnelId = document.getElementById('personnelId').value;
 
             
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
            $('#tableBody').empty()
            $('#updateUserModal').modal('hide')
            $('#personnelUpdatedToast').toast('show')
            document.getElementById('updatePersonnelToastBody').innerHTML = `${updateFirstName}'s profile has been updated.`
            $('#tableBody').empty()
            populatePersonnel()

        }
    }) 
    })
    $('#updateUserModal').on('show.bs.modal', function(){
        console.log('modal shown update user')

        //Populates the department dropdown for the update user modal
        $('#updateDepartmentPersonnel').empty()
            let updateDepartmentDropdown = document.getElementById('updateDepartmentPersonnel')
            getAllDepartments().done((result) => {
                    result.data.forEach(element => {
                        let opt = document.createElement('option');   
                        opt.value = element.departmentID
                        opt.textContent = element.department
                        updateDepartmentDropdown.appendChild(opt)
                    })
                })

        $.ajax({
            url:"libs/php/getPersonnelByID.php",
            type:"GET",
            dataType: "json",
            data:{
                id: 1
            }, success: function(result){
                console.log(result)
            document.getElementById('updatefName').value = result.data.personnel[0].firstName
            document.getElementById('updatelName').value = result.data.personnel[0].lastName;
            document.getElementById('updateJob').value = result.data.personnel[0].jobTitle;
            document.getElementById('updateEmail').value = result.data.personnel[0].email;
            document.getElementById('updateDepartmentPersonnel').value = result.data.personnel[0].departmentID
            }
            
        })
    })
    $('#locationForm').on("change", function () {
        const chosenValue = this.value;
        $('#tableBody').empty()

        getAllPersonnel().done((result) => {
            result.data.forEach(element => {
                if (element.locationId == chosenValue) {
                    $('#tableBody').append(`<tr>
                    <td>${
                        element.lastName
                    },
                    ${
                        element.firstName
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
    
                        <a href="#" class="edit" title="edit" data-bs-toggle="modal" data-bs-target="#updateUserModal" id="button" data-personnelId=${
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
            $(".edit").on("click", function () {
                settingsButton(this)
            })


        })


    })
    $('#departmentHeader').on("click", function () {
        $('#tableBody').empty()
        populateDepartmentTab()
    })
    $('#departmentForm').on("change", function () {
        const chosenValue = this.value;
        $('#tableBody').empty()
        getAllPersonnel().done((result) => {
            result.data.forEach(element => {
                if (element.departmentID == chosenValue) {
                    $('#tableBody').append(`<tr>
                    <td>${
                        element.lastName
                    }, ${
                        element.firstName
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
                    } ><i class="fa-solid fa-pencil"></i></a>
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
   
   
    $('#testingButton').on("click", function(){
        if($('.nav-link active').attr('id') == "location-tab"){
            console.log('location tab')
            $('#addLocationModal').modal('show')
            console.log('location tab')
        } else if($('.nav-link active').attr('id') == 'department-tab'){
            $('#addDepartmentModal').modal('show')
            console.log('department tab')
        } else if($('.nav-link active').attr('id') == 'employee-tab'){
            console.log('final tab')
            // $('#addUserModal').modal('show')
        }
        // var addDepartment = document.getElementById('addDepartment')
        // $('#addDepartment').empty()
        
        // getAllDepartments().done((result)=> {
        //     result.data.forEach(element => {
        //     let opt = document.createElement('option');
        //     opt.value = element.departmentID;
        //     opt.textContent = element.department
        //     addDepartment.appendChild(opt)
        //     })
           
        // })
    })
    $('#departmentForm').on("click", function(){
        $('#departmentForm').empty()
        var departmentDropdown = document.getElementById('departmentForm');
       
          getAllDepartments().done((result)=> {
            result.data.forEach(element => {
            let opt = document.createElement('option');
            opt.value = element.departmentID;
            opt.textContent = element.department
            departmentDropdown.appendChild(opt)
            })
           
        })  
        
    })
    $('#locationForm').on("click", function(){
        $('#locationForm').empty()
        var locationDropdown = document.getElementById('locationForm');
        getAllLocation().done((result) => {
            result.data.forEach(element => {
                let opt = document.createElement('option');
                opt.value = element.departmentID
                opt.textContent = element.name  
                locationDropdown.appendChild(opt)   
            })
        })
    })
    $('#deleteLocationModalBtn').on("click", function(){
        $('#deleteLocation').empty()
        var deleteLocation = document.getElementById('deleteLocation')
        getAllLocation().done((result) => {
            result.data.forEach(element => {
                let opt = document.createElement('option');
                opt.value = element.id
                opt.textContent = element.name  
                deleteLocation.appendChild(opt)   
            })
        })
    })
   
    $('#addDepartmentBtn').on("click", function () {
        $('#addDepartmentLocation').empty()
        var locationSelect = document.getElementById('addDepartmentLocation');
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
        if(addNewDepartment == ""){
            alert('Department field not filled')
        } else {
         $.ajax({
            url: "libs/php/insertDepartment.php",
            type: "POST",
            dataType: "json",
            data: {
                name: addNewDepartment,
                locationID: addDepartmentLocation
            },
            success: function (result) {
                $('#addDepartmentModal').modal('hide')
                $('#departmentAddedToast').toast('show')
                $('#departmentTableBody').empty()
                populateDepartmentTab()

            }
        })   
        }
        
    })
    $('#deleteDepartmentBtn').on("click", function () {
        $('#deleteDepartmentLocation').empty()
        let deleteDepartmentDropdown = document.getElementById('deleteDepartmentLocation');
        getAllDepartments().done((result) => {
            result.data.forEach(element => {
                let opt = document.createElement('option');
                opt.value = element.departmentID
                opt.textContent = element.department
                deleteDepartmentDropdown.appendChild(opt)

            })
        })
    })
    $('#deleteDepartmentButton').on("click", function () {
        let departmentDropdownValue = document.getElementById('deleteDepartmentLocation').value;
        $.ajax({
            url: "libs/php/deleteDepartmentByID.php",
            type: "POST",
            dataType: "json",
            data: {
                departmentID: departmentDropdownValue,
                id: departmentDropdownValue
            },
            success: function (result) {
                console.log(result)
                if (result.status.code == 200) {
                    console.log('this passed')
                    $('#deleteDepartmentModal').modal('hide')
                    $('#departmentDeleteToast').toast('show')
                    $('#departmentTableBody').empty()
                    populateDepartmentTab()
                } else if (result.status.code == 400) {
                    $('#cannotDeleteDepartmentToast').toast('show')
                }
            }
        })
    })
    $('#addLocationButton').on("click", function () {

        let addNewLocation = document.getElementById('addNewLocation').value;
        if(addNewLocation == ""){
            alert('Location field not filled')
        } else {
          $.ajax({
            url: "libs/php/insertLocation.php",
            type: "POST",
            dataType: "json",
            data: {
                name: addNewLocation
            },
            success: function (result) {

                $('#addLocationModal').modal('hide')
                $('#locationAddedToast').toast('show')
                document.getElementById('addedLocationToastBody').innerHTML = `${addNewLocation} added as a new location.`
                $('#locationTableBody').empty()
                populateLocationTab()
            }
        })  
        }
        
    })
    $('#deleteLocationButton').on("click", function () {
        let deletedLocationId = document.getElementById('deleteLocation').value;
        var deletedLocationName = $('#deleteLocation option:selected').text()

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
                if(result.status.code == "200") {
                    $('#deleteLocationModal').modal('hide')
                    $('#locationDeleteToast').toast('show')
                    $('#locationTableBody').empty()
                    populateLocationTab()

                } else if(result.status.code = "400") {
                    $('#cannotDeleteLocationToast').toast('show')

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
    $(el).closest("td").css({"color": "red"})
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
            if(result.status.code == "200"){
              $(el).closest("td").text('Location Deleted')
            $('#locationDeleteToast').toast('show')  
            $('#locationTableBody').empty();
            populateLocationTab()
            } else if (result.status.code == "400"){
                $('#cannotDeleteLocationToast').toast('show')
            }
          }
    })

}
const deleteDepartmentButton = (el) => {
    let departmentId = $(el).attr("data-departmentId")
    console.log('delete BUtton GGGG')
    $(el).closest("td").css({"color": "red"})
    $.ajax({
        url: "libs/php/deleteDepartmentByID.php",
        type: "POST",
        dataType: "json",
        data: {
            departmentID: departmentId,
            id: departmentId

        },
        success: function (result) {
            console.log(result)
            if (result.status.code == "200") {
               $('#departmentDeleteToast').toast('show')
               
                $(el).closest("td").text('Department Deleted')
            } else if (result.status.code = "400") {
                $('#cannotDeleteDepartmentToast').toast('show')

            }
        }
    })
}
const updateLocationButton = (locationId) => {
    let updatedLocationValue = document.getElementById('updateLocationTab').value;
    if(updatedLocationValue == ""){
        alert('Please enter location')
    } else {
    $('#locationTableBody').empty()
        $.ajax({
                url: "libs/php/updateLocation.php",
                type: "POST",
                dataType: "json",
                data: {
                    name: updatedLocationValue,
                    id: locationId
                },
                success: function (result) {
                    $('#updateLocationModal').modal('hide');
                    document.getElementById('updateLocationToastBody').innerHTML = `Location updated to ${updatedLocationValue}`
                    $('#locationUpdateToast').toast('show')
                    $('#locationTableBody').empty()
                    populateLocationTab()

                }
            })

    }
    

  
   
}
const updateDepartmentButton = (departmentId) => {
    let updatedDepartmentValue = document.getElementById('updateDepartmentTab').value;
    let updateLocationDepartmentTabDropdown = document.getElementById('updateLocationDepartmentTab').value;
    console.log(updateLocationDepartmentTabDropdown)
    if(updatedDepartmentValue == ""){
        alert('Please enter department')
    } else {
      $.ajax({
        url: "libs/php/updateDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            name: updatedDepartmentValue,
            locationID: updateLocationDepartmentTabDropdown,
            id: departmentId
        },
        success: function (result) {
            $('#updateDepartmentTabModal').modal('hide');
            $('#departmentUpdateToast').toast('show')
            $('#departmentTableBody').empty()
            document.getElementById('updateDepartmentToastBody').innerText = `Department updated to ${updatedDepartmentValue}`
            populateDepartmentTab()
        }
    })  
    }
    
}
const deleteButton = (el) => {
    let personnelId = $(el).attr("data-personnelId")

    $(el).closest("td").css({"color": "red"})

    $.ajax({
        url: "libs/php/deletePersonnel.php",
        type: "POST",
        dataType: "json",
        data: {
            id: personnelId
        },
        success: function (result) {
            $(el).closest("td").text(`${
                result.data.firstName
            } ${
                result.data.lastName
            } has been deleted`)
            $('#tableBody').empty()
            populatePersonnel()
            document.getElementById('deletePersonnelToastBody').innerHTML = `${result.data.firstName} ${result.data.lastName} has been deleted`
            $('#personnelDeletedToast').toast('show')

        }
    })
}

// const settingsButton = (el) => {
//     $('#updateDepartmentPersonnel').empty()
//     let updateDepartmentDropdown = document.getElementById('updateDepartmentPersonnel')
//     getAllDepartments().done((result) => {
//             result.data.forEach(element => {
//                 let opt = document.createElement('option');   
//                 opt.value = element.departmentID
//                 opt.textContent = element.department
//                 updateDepartmentDropdown.appendChild(opt)
//             })
//         })
//     let personnelId = $(el).attr("data-personnelId")
//     document.getElementById('personnelId').value = personnelId;
//     getAllPersonnel().done((result) => {
//         result.data.forEach(element => {
//             if (element.id == personnelId) {
//                 document.getElementById('updatefName').value = element.firstName
//                 document.getElementById('updatelName').value = element.lastName;
//                 document.getElementById('updateJob').value = element.jobTitle;
//                 document.getElementById('updateEmail').value = element.email;
//             }
//         })

//     })

// }

const populatePersonnel = ()=>{
    getAllPersonnel().done((result) => {
        $.each(result.data, function (i, item) {
            $('#tableBody').append(`<tr>
				<td class="text-nowrap">
               ${
                result.data[i].lastName
            }, ${
                result.data[i].firstName
            }
				</td>                        
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
            } ><i class="fa-solid fa-pencil"></i></a>
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
            // settingsButton(this)
        })
        $(".delete locationDelete").on("click", function () {
            deleteLocationButton(this)
        })

    })
}
// $('#updateUserBtn').on("click", function () {
//     let updateFirstName = document.getElementById('updatefName').value;
//     let updateLastName = document.getElementById('updatelName').value;
//     let updateJob = document.getElementById('updateJob').value;
//     let updateEmail = document.getElementById('updateEmail').value;
//     let updateDepartment = document.getElementById('updateDepartmentPersonnel').value;
//     let personnelId = document.getElementById('personnelId').value;
 
             
//       $.ajax({
//         url: "libs/php/updatePersonnel.php",
//         type: "POST",
//         dataType: 'json',
//         data: {
//             firstName: updateFirstName,
//             lastName: updateLastName,
//             jobTitle: updateJob,
//             email: updateEmail,
//             departmentID: updateDepartment,
//             id: personnelId
//         },
//         success: function (result) {
//             $('#tableBody').empty()
//             $('#updateUserModal').modal('hide')
//             $('#personnelUpdatedToast').toast('show')
//             document.getElementById('updatePersonnelToastBody').innerHTML = `${updateFirstName}'s profile has been updated.`
//             $('#tableBody').empty()
//             populatePersonnel()

//         }
//     })  
//     }
    
// })

const populateLocationTab = () => {
    getAllLocation().done((result) => {
        $.each(result.data, function (i, item) {
            $('#locationTableBody').append(`<tr>
                <td class="text-nowrap">${
                result.data[i].name
            }</td>               
               <td class=text-right>

                    <a href="#" class="settings locationSettings" title="Settings" data-bs-toggle="modal" data-bs-target="#updateLocationModal" id="button" data-locationId=${
                result.data[i].id
            } ><i class="fa-solid fa-pencil"></i></a>
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
            getAllLocation().done((result) => {
                result.data.forEach(element =>{
                    if (element.id == locationId){
                        document.getElementById('updateLocationTab').value = element.name
                    }
                })
            })
            $('#updateLocationButtonTab').on("click", function () {
                updateLocationButton(locationId)

            })
        })
    })
}
const populateDepartmentTab = () => {
    getAllDepartments().done((result) => {
        $.each(result.data, function (i, item) {
            $('#departmentTableBody').append(`<tr>
                <td class="text-nowrap">${
                result.data[i].department
            }</td>
            <td class="text-nowrap">${result.data[i].location}               
               <td>

                    <a href="#" class="departmentSettings settings" title="Settings" data-bs-toggle="modal" data-bs-target="#updateDepartmentTabModal" id="button" data-departmentId=${
                result.data[i].departmentID
            } ><i class="fa-solid fa-pencil"></i></a>
                    <a href="#" class="departmentDelete delete" title="Delete" data-departmentId=${
                result.data[i].departmentID
            } ><i class="fa-solid fa-user-xmark"></i></a>
                </td>
            </tr>
                `)
        })
        $('.departmentDelete').on("click", function () {
            $('#departmentTableBody').empty()
            deleteDepartmentButton(this)
            populateDepartmentTab()
        })
        $('.departmentSettings').on("click", function () {
            let departmentId = $(this).attr("data-departmentId")
            $('#updateLocationDepartmentTab').empty();
            var updatedDepartmentTabLocation = document.getElementById('updateLocationDepartmentTab')
            getAllDepartments().done((result) => {
                result.data.forEach(element => {
                    if (element.departmentID == departmentId) {
                        document.getElementById('updateDepartmentTab').value = element.department
                        document.getElementById('updateLocationDepartmentTab').value = element.locationId
                    }
                })
        
            })
            getAllLocation().done((result) => {
                result.data.forEach(element => {
                    let opt = document.createElement('option');
                    opt.value = element.id
                    opt.textContent = element.name
                    updatedDepartmentTabLocation.appendChild(opt)
                })
            })
        
            $('#updateDepartmentButtonTab').on("click", function () {
                updateDepartmentButton(departmentId)
            })


        })
    })
}