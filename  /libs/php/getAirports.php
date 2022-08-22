<?php

$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://geo-services-by-mvpc-com.p.rapidapi.com/airports?". 'language=en'.'&countrycode=' . $_REQUEST['countryCode'],
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"X-RapidAPI-Host: geo-services-by-mvpc-com.p.rapidapi.com",
		"X-RapidAPI-Key: 7a75433a41msh42e7810b3e4150dp1de573jsn8cb6c6adcc65"
	],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
	echo "cURL Error #:" . $err;
} else {
	echo $response;
}