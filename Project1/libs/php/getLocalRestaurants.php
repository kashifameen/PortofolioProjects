<?php

    ini_set('display_errors' , 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $url='https://www.triposo.com/api/20220705/local_highlights.json?tag_labels=cuisine-Afghan|cuisine-African|cuisine-American|cuisine-Argentinian|cuisine-Austrian|cuisine-Balkan|cuisine-Australian|cuisine-Asian|cuisine-Bangladeshi|cuisine-Baltic|cuisine-Basque|cuisine-Belgian|cuisine-Burmese|cuisine-British|cuisine-Brazilian|cuisine-Cambodian|cuisine-Canadian|cuisine-Cajun|cuisine-Caribbean|cuisine-Central_european|cuisine-Central_american|cuisine-Caucasian|cuisine-Chinese|cuisine|cuisine-Dutch|cuisine-East_african|cuisine-Filipino|cuisine-French|cuisine-Fusion|cuisine-German|cuisine-Indian|cuisine-Japanese|cuisine-Italian|cuisine-Korean|cuisine-Malaysian|cuisine-Mediterranean|cuisine-Middle_eastern|cuisine-Mexican|cuisine-Mongolian|cuisine-North_african|cuisine-Nordic|cuisine-Pakistani|cuisine-Polynesian|cuisine-Portuguese|eatingout_establishment|poitype-Restaurant|cuisine-Russian|cuisine-Singaporean|cuisine-Sri_lankan|cuisine-Spanish|cuisine-Southern|cuisine-Surinamese|cuisine-Swiss|cuisine-Turkish|cuisine-Uzbek|cuisine-Vietnamese' . '&max_distance=10000'. '&latitude='. $_REQUEST['lat'] .'&longitude='. $_REQUEST['lng'] . '&account=D2EA23HJ'.'&token=y10rh758lfhs8u6rqlmbo0tmbyvlpqqr'; 

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