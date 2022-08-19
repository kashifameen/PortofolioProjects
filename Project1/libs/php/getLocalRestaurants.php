<?php

    ini_set('display_errors' , 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);
    $url='https://www.triposo.com/api/20220705/local_highlights.json?tag_labels=cuisine-Austrian|cuisine-Balkan|cuisine-Baltic|cuisine-Belgian|cuisine-Brazilian|cuisine-British|cuisine-Burmese|cuisine-Cambodian|cuisine-Canadian|cuisine-Cajun|cuisine-Caribbean|cuisine-Caucasian|cuisine-Central_american|cuisine-Central_european|cuisine-Chinese|cuisine-Greek|cuisine-Fusion|cuisine-German|cuisine-Indonesian|cuisine-Indian|cuisine-International|cuisine-Irish|cuisine-Israeli|cuisine-Italian|cuisine-Japanese|cuisine-Korean|cuisine-Malaysian|cuisine-Mexican|cuisine-Mediterranean|cuisine-Middle_eastern|cuisine-Mongolian|cuisine-Pakistani|cuisine-Persian|eatingout_establishment|cuisine-Polynesian|cuisine-Portuguese|cuisine-Vietnamese|cuisine-Vegetarian|cuisine-Uzbek|cuisine-Turkish|cuisine-Tex-mex|cuisine-Tibetan|cuisine-Thai|cuisine-Swiss|cuisine-Surinamese|cuisine-Sri_lankan|cuisine-Singaporean|cuisine-Russian&max_distance=1000&latitude=52.3676378&longitude=4.8923905';
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