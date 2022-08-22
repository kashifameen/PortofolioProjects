<?php

    ini_set('display_errors' , 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $url='https://www.triposo.com/api/20220705/local_highlights.json?&max_distance=5000' . '&latitude='. $_REQUEST['lat'] .'&longitude='. $_REQUEST['lng'] . '&account=D2EA23HJ'.'&token=y10rh758lfhs8u6rqlmbo0tmbyvlpqqr'; 

	$ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

    $result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	 
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode['results'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 