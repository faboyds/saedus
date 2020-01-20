<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../../../access.php');

$postdata = file_get_contents("php://input");
$data = json_decode($postdata);

$email = $data->email;
$password = $data->password;
$fname = $data->fname;
$lname = $data->lname;
$add1 = $data->add1;
$add2 = $data->add2;
$city = $data->city;
$zip = $data->zip;

$response = new stdClass();

$sql = "SELECT * FROM users WHERE email = '$email'";
$rstEmail = mysqli_query($conn, $sql);

if (mysqli_num_rows($rstEmail) > 0) {

    $response->success = false;
    $response->error = true;
    $response->message = 'E-mail already in use.';

}

else {

    $sql = "INSERT INTO users (email, password, fname, lname, description, address1, address2, city, zip) VALUES ('$email', '$password', '$fname', '$lname', 'Hi! Check my profile for more info.', '$add1', '$add2', '$city', '$zip')";
    $rst = mysqli_query($conn, $sql);
    
    $user = $conn->insert_id;

    $sql = "INSERT INTO wallet (user) VALUES ('$user')";
    $rst = mysqli_query($conn, $sql);

    $response->success = true;
    $response->id = $user;
    $response->error = false;

}

echo json_encode($response);
