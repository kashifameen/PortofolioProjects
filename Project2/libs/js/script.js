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
    $('#addUserModal').on('show.bs.modal', function(){
        $('#addDepartment').empty()
         var addDepartment = document.getElementById('addDepartment')
             getAllDepartments().done((result)=> {
            result.data.forEach(element => {
            let opt = document.createElement('option');
            opt.value = element.departmentID;
            opt.textContent = element.department
            addDepartment.appendChild(opt)
            })
           
        })
    })
   
    $('#updateUserForm').on("submit", function(e){
        e.preventDefault()
        let updateFirstName = document.getElementById('updatefName').value;
        let updateLastName = document.getElementById('updatelName').value;
        let updateJob = document.getElementById('updateJob').value;
        let updateEmail = document.getElementById('updateEmail').value;
        let updateDepartment = document.getElementById('updateDepartmentPersonnel').value;
        let personnelId = document.getElementById('personnelID').value;
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
            $('#tableBody').empty()
            $('#updateUserModal').modal('hide')
            $('#personnelUpdatedToast').toast('show')
            document.getElementById('updatePersonnelToastBody').innerHTML = `${updateFirstName}'s profile has been updated.`
            $('#tableBody').empty()
            populatePersonnel()

        }
    }) 
    })
    $('#updateUserModal').on('show.bs.modal', function(e){
    var personnelId = $(e.relatedTarget).data('personnelid')
    console.log(personnelId)
    document.getElementById('personnelID').value = personnelId
    
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
                id: personnelId
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
    $('#addNewDepartmentForm').on("submit", function(e){
        e.preventDefault()
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
                $('#addDepartmentModal').modal('hide')
                $('#departmentAddedToast').toast('show')
                $('#departmentTableBody').empty()
                populateDepartmentTab()

            }
        })   
        
    })
    $('#addDepartmentModal').on('show.bs.modal', function(){
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
    $('#updateDepartmentForm').on("submit", function(e){
        e.preventDefault()
        let updatedDepartmentValue = document.getElementById('updateDepartmentTab').value;
        let departmentId = document.getElementById('updateDepartmentId').value 

        let updateLocationDepartmentTabDropdown = document.getElementById('updateLocationDepartmentTab').value;
        console.log(updateLocationDepartmentTabDropdown)
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
    })
    $('#updateDepartmentTabModal').on('show.bs.modal',function(e){
        var departmentId = $(e.relatedTarget).data('departmentid')
        console.log(departmentId)
        document.getElementById('updateDepartmentId').value = departmentId
        var updatedDepartmentTabLocation = document.getElementById('updateLocationDepartmentTab')
        getAllLocation().done((result) => {
                    result.data.forEach(element => {
                        let opt = document.createElement('option');
                        opt.value = element.id
                        opt.textContent = element.name
                        updatedDepartmentTabLocation.appendChild(opt)
                    })
                })
                $.ajax({
                    url:"libs/php/getDepartmentById.php",
                    type:"GET",
                    dataType: "json",
                    data:{
                        id: departmentId
                    }, success: function(result){
                        if(result.status.code == "200"){
                         console.log(result)
                        document.getElementById('updateDepartmentTab').value = result.data[0].name
                        document.getElementById('updateLocationDepartmentTab').value = result.data[0].locationID
                        } else {
                            console.log('ERROR')
                        }
                        
                    }
                })
        
    })
   $('#locationForm').on("submit", function(e){
       e.preventDefault()
       let newLocation = document.getElementById('addNewLocation').value;
       $.ajax({
           url:"libs/php/insertLocation.php",
           type:"POST",
           dataType:"json",
           data: {
               name: newLocation,
           }, success: function(result){
               console.log(result)
               $('#addLocationModal').modal('hide')
               $('#locationAddedToast').toast('show')
               $('#locationTableBody').empty()
                populateLocationTab()
           }
       })
   })
    $('#updateLocationForm').on("submit", function(e){
        e.preventDefault()
        let updatedLocationValue = document.getElementById('updateLocationTab').value;
        let updateLocationId = document.getElementById('updateLocationId').value
        $.ajax({
                url: "libs/php/updateLocation.php",
                type: "POST",
                dataType: "json",
                data: {
                    name: updatedLocationValue,
                    id: updateLocationId,
                },
                success: function (result) {
                    console.log(result)
                    $('#updateLocationModal').modal('hide');
                    document.getElementById('updateLocationToastBody').innerHTML = `Location updated to ${updatedLocationValue}`
                    $('#locationUpdateToast').toast('show')
                    $('#locationTableBody').empty()
                    populateLocationTab()

                }
            })



    })
    $('#deletePersonnelModal').on('show.bs.modal', function(e){
        var personnelId = $(e.relatedTarget).data('personnelid')
        console.log(personnelId)
        document.getElementById('deleteModalPersonnelId').value = personnelId

    })

    $('#deleteButton').on('click', function(){
        var personnelId = document.getElementById('deleteModalPersonnelId').value
        $.ajax({
            url: "libs/php/deletePersonnel.php",
            type: "POST",
            dataType: "json",
            data: {
                id: personnelId
            },
            success: function (result) {
                console.log(result)
              
                $('#tableBody').empty()
                populatePersonnel()
                document.getElementById('deletePersonnelToastBody').innerHTML = `${result.data.firstName} ${result.data.lastName} has been deleted`
                $('#personnelDeletedToast').toast('show')
                $('#deleteModal').modal('hide')
            }
        })
    })
    $('#deleteDepartmentModal').on('show.bs.modal', function(e){
        var departmentId = $(e.relatedTarget).data('departmentid')
        document.getElementById('deleteModalDepartmentId').value = departmentId
        $.ajax({
            url:"libs/php/checkIfDepartmentLinked.php",
            type:"GET",
            dataType:"json",
            data: {
                id: departmentId
            }, success: function(result){
                if(result.linkedToPersonnel == true){
                    document.getElementById('deleteModalHeader').innerHTML = `<h4>Cannot Delete Department</h4>`
                    document.getElementById('deleteDepartmentModalBody').innerHTML= `<p>This department is linked to an employee so it cannot be deleted</p>`
                    document.getElementById('deleteDepartmentButton').style.display = 'none'
    
                }else if(result.linkedToPersonnel == false){
                    document.getElementById('deleteModalHeader').innerHTML = `<h4>Are you sure you want to delete?</h4>`
                    document.getElementById('deleteDepartmentModalBody').innerHTML= `<p>Do you really want to delete this department? This process cannot be undone</p>`
                    document.getElementById('deleteDepartmentButton').style.display = 'block'
                }   
            }
        })

    })
    $('#deleteDepartmentButton').on("click", function(){
        let departmentId = document.getElementById('deleteModalDepartmentId').value;
        $.ajax({
            url:"libs/php/deleteDepartmentByID.php",
            type: "POST",
            dataType: "json",
            data: {
                id: departmentId
            }, success: function(result){
                console.log(result)
                if (result.status.code == 200) {
                    console.log('this passed')
                    $('#departmentDeleteToast').toast('show')
                    $('#departmentTableBody').empty()
                    populateDepartmentTab()
                } else if (result.status.code == 400) {
                    $('#cannotDeleteDepartmentToast').toast('show')
                    $('#deleteModalBody').replaceWith("Error Deleting Data")
                }
            }
        })
    })
    $('#deleteLocationModal').on('show.bs.modal', function(e){
        var locationid = $(e.relatedTarget).data('locationid')
        document.getElementById('deleteModalLocationId').value = locationid
        console.log(locationid)
        $.ajax({
            url:"libs/php/checkIfLocationLinked.php",
            type:"GET",
            dataType:"json",
            data: {
                id: locationid
            }, success: function(result){
                console.log(result)
                if(result.linkedToDepartment == true){
                    document.getElementById('deleteLocationModalHeader').innerHTML = `<h4>Cannot Delete Location</h4>`
                    document.getElementById('deleteLocationModalBody').innerHTML= `<p>This location is linked to a department so it cannot be deleted</p>`
                    document.getElementById('deleteLocationButton').style.display = 'none'
                    $('#cannotDeleteLocationToast').toast('show')


                }else if(result.linkedToDepartment == false){
                    document.getElementById('deleteLocationModalHeader').innerHTML = `<h4>Are you sure you want to delete?</h4>`
                    document.getElementById('deleteLocationModalBody').innerHTML= `<p>Do you really want to delete this location? This process cannot be undone.</p>`
                    document.getElementById('deleteLocationButton').style.display = 'block'

                 }   
            }

        })
    })
    $('#deleteLocationButton').on("click", function(){
        let locationid = document.getElementById('deleteModalLocationId').value
        $.ajax({
            url:"libs/php/deleteLocationByID.php",
            type: "POST",
            dataType: "json",
            data:{
                id: locationid
            }, success: function(result){
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

    $('#updateLocationModal').on('show.bs.modal', function(e){
        var locationid = $(e.relatedTarget).data('locationid')
        document.getElementById('updateLocationId').value = locationid
        $.ajax({
            url:"libs/php/getLocationById.php",
            type:"GET",
            dataType:"json",
            data:{
                id: locationid
            }, success: function(result){
                
                    document.getElementById('updateLocationTab').value = result.data[0].name 
                
                
            }

        })
    })
    $('#locationFormDropdown').on("change", function () {
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
    
                        <a href="#" class="edit" title="edit" data-bs-toggle="modal" data-bs-target="#updateLocationModal" id="button" data-personnelId=${
                        element.id
                    } ><i class="fa-solid fa-gears"></i></a>
                        <a href="#" class="delete" title="Delete" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-personnelId=${
                        element.id
                    } ><i class="fa-solid fa-user-xmark"></i></a>
                    </td>
                </tr>
                    `)
                }
            })
            // $(".delete").on("click", function () {
            //     deleteButton(this)
            // })
           



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
                        <a href="#" class="edit" title="edit" data-bs-toggle="modal" data-bs-target="#updateDepartmentTabModal" id="button" data-personnelId=${
                        element.id
                    } ><i class="fa-solid fa-pencil"></i></a>
                        <a href="#" class="delete" title="Delete"  data-bs-toggle="modal" data-bs-target="#deleteModal" data-personnelId=${
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
            

        })
 
    })

   
    $('#addBtn').on("click", function(){
    
        
        if($('.nav-link.active').attr('id') == "location-tab"){
            $('#addLocationModal').modal('show')
        } else if($('.nav-link.active').attr('id') == 'department-tab'){
            $('#addDepartmentModal').modal('show')
        } else if($('.nav-link.active').attr('id') == 'employee-tab'){
            $('#addUserModal').modal('show')
        }
        
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
    $('#locationFormDropdown').on("click", function(){
        $('#locationFormDropdown').empty()
        var locationDropdown = document.getElementById('locationFormDropdown');
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
// const deleteLocationButton = (el) => {
//     let locationId = $(el).attr("data-locationId")
//     $(el).closest("td").css({"color": "red"})
//     $.ajax({
//         url: "libs/php/deleteLocationByID.php",
//         type: "GET",
//         dataType: "json",
//         data: {
//             locationID: locationId,
//             id: locationId
//         },
//         success: function (result) {
//             console.log(result)
//             if(result.status.code == "200"){
//               $(el).closest("td").text('Location Deleted')
//             $('#locationDeleteToast').toast('show')  
//             $('#locationTableBody').empty();
//             populateLocationTab()
//             } else if (result.status.code == "400"){
//                 $('#cannotDeleteLocationToast').toast('show')
//             }
//           }
//     })

// }
// const deleteDepartmentButton = (el) => {
//     let departmentId = $(el).attr("data-departmentId")
//     console.log('delete BUtton GGGG')
//     $(el).closest("td").css({"color": "red"})
//     $.ajax({
//         url: "libs/php/deleteDepartmentByID.php",
//         type: "POST",
//         dataType: "json",
//         data: {
//             departmentID: departmentId,
//             id: departmentId

//         },
//         success: function (result) {
//             console.log(result)
//             if (result.status.code == "200") {
//                $('#departmentDeleteToast').toast('show')
               
//                 $(el).closest("td").text('Department Deleted')
//             } else if (result.status.code = "400") {
//                 $('#cannotDeleteDepartmentToast').toast('show')

//             }
//         }
//     })
// }


// const deleteButton = (el) => {
//     let personnelId = $(el).attr("data-personnelId")

//     $(el).closest("td").css({"color": "red"})

//     $.ajax({
//         url: "libs/php/deletePersonnel.php",
//         type: "POST",
//         dataType: "json",
//         data: {
//             id: personnelId
//         },
//         success: function (result) {
//             $(el).closest("td").text(`${
//                 result.data.firstName
//             } ${
//                 result.data.lastName
//             } has been deleted`)
//             $('#tableBody').empty()
//             populatePersonnel()
//             document.getElementById('deletePersonnelToastBody').innerHTML = `${result.data.firstName} ${result.data.lastName} has been deleted`
//             $('#personnelDeletedToast').toast('show')

//         }
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

					<a href="#" class="edit" title="edit" data-bs-toggle="modal" data-bs-target="#updateUserModal" id="button" data-personnelId=${
                result.data[i].id
            } ><i class="fa-solid fa-pencil"></i></a>
					<a href="#" class="delete" title="Delete" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-personnelId=${
                result.data[i].id
            } ><i class="fa-solid fa-user-xmark"></i></a>
				</td>
			</tr>
				`)
        })
        // $(".delete").on("click", function () {
        //     deleteButton(this)
        // })
       
        $(".delete locationDelete").on("click", function () {
            deleteLocationButton(this)
        })

    })
}


const populateLocationTab = () => {
    getAllLocation().done((result) => {
        $.each(result.data, function (i, item) {
            $('#locationTableBody').append(`<tr>
                <td class="text-nowrap">${
                result.data[i].name
            }</td>               
               <td class=text-right>

                    <a href="#" class="edit" title="Edit" data-bs-toggle="modal" data-bs-target="#updateLocationModal" id="button" data-locationId=${
                result.data[i].id
            } ><i class="fa-solid fa-pencil"></i></a>
                    <a href="#" class="delete locationDelete" title="Delete" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-locationId=${
                result.data[i].id
            } ><i class="fa-solid fa-user-xmark"></i></a>
                </td>
            </tr>
                `)
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

                    <a href="#" class="edit" title="Edit" data-bs-toggle="modal" data-bs-target="#updateDepartmentTabModal" id="button" data-departmentId=${
                result.data[i].departmentID
            } ><i class="fa-solid fa-pencil"></i></a>
                    <a href="#" class="departmentDelete delete" title="Delete" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-departmentId=${
                result.data[i].departmentID
            } ><i class="fa-solid fa-user-xmark"></i></a>
                </td>
            </tr>
                `)
        })
      
    })
}