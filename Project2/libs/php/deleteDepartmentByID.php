<?php

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

	$query = $conn->prepare('SELECT * FROM personnel WHERE departmentID = ?');
	
	$query->bind_param("i", $_POST['departmentID']);

	$query->execute();
	
	$result = $query->get_result();
    $numRows = $result->num_rows;
	if (!$numRows) {
		$query = $conn->prepare('DELETE FROM department where id = ?');
		$query->bind_param("i", $_POST['id']);
		$query->execute();
		$output['status']['code'] = "200";
			$output['status']['name'] = "ok";
			$output['status']['description'] = "success";
			$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
			$output['data'] = ['Success'];
			
			mysqli_close($conn);
			echo json_encode($output); 

	} else {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = ['Failed'];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;
	
	} 
	

?>