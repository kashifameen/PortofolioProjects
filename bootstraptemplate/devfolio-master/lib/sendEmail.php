<?php
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// require 'PHPMailer/src/Exception.php';
// require 'PHPMailer/src/PHPMailer.php';
// require 'PHPMailer/src/SMTP.php';

// if(isset($_POST["send"])){
//     $mail = new PHPMailer((true));

//     $mail->isSMTP();
//     $mail->Host = 'smtp.ionos.co.uk';
//     $mail->SMTPAuth = true;
//     $mail->Username = 'jobs@kashifameen.com';
//     $mail->Password = 'KillahK654';
//     $mail->SMTPSecure='ssl';
//     $mail->Port = 587;

//     $mail->setFrom('jobs@kashifameen.com');
//     $mail->addAddress($_POST["email"]);

//     $mail->isHTML(true);
//     $mail->Subject = $_POST["subject"];
//     $mail->Body = <<<EOT
//     Name: {$_POST['name']}
//     Message: {$_POST['message']}
//     EOT;

//     $mail->send();

//     echo "Sent Successfully";

// }
//Import PHPMailer class into the global namespace
use PHPMailer\PHPMailer\PHPMailer;

//Don't run this unless we're handling a form submission
if (array_key_exists('email', $_POST)) {
    date_default_timezone_set('Etc/UTC');
    require '../vendor/autoload.php';
    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
        strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

    //Create a new PHPMailer instance
    $mail = new PHPMailer();
    //Send using SMTP to localhost (faster and safer than using mail()) – requires a local mail server
    //See other examples for how to use a remote server such as gmail
    $mail->isSMTP();
    $mail->Host = 'smtp.ionos.co.uk';
    $mail->Port = 587;

    //Use a fixed address in your own domain as the from address
    //**DO NOT** use the submitter's address here as it will be forgery
    //and will cause your messages to fail SPF checks
    $mail->setFrom('jobs@kashifameen.com', 'Email');
    //Choose who the message should be sent to
    //You don't have to use a <select> like in this example, you can simply use a fixed address
    //the important thing is *not* to trust an email address submitted from the form directly,
    //as an attacker can substitute their own and try to use your form to send spam
    $addresses = [
        'sales' => 'sales@kashifameen.com',
    ];
    //Validate address selection before trying to use it
    if (array_key_exists('dept', $_POST) && array_key_exists($_POST['dept'], $addresses)) {
        $mail->addAddress($addresses[$_POST['dept']]);
    } else {
        //Fall back to a fixed address if dept selection is invalid or missing
        $mail->addAddress('jobs@kashifameen.com');
    }
    //Put the submitter's address in a reply-to header
    //This will fail if the address provided is invalid,
    //in which case we should ignore the whole request
    if ($mail->addReplyTo($_POST['email'], $_POST['name'])) {
        $mail->Subject = 'PHPMailer contact form';
        //Keep it simple - don't use HTML
        $mail->isHTML(false);
        //Build a simple message body
        $mail->Body = <<<EOT
Email: {$_POST['email']}
Name: {$_POST['name']}
Message: {$_POST['message']}
EOT;

        //Send the message, check for errors
        if (!$mail->send()) {
            //The reason for failing to send will be in $mail->ErrorInfo
            //but it's unsafe to display errors directly to users - process the error, log it on your server.
            if ($isAjax) {
                http_response_code(500);
            }

            $response = [
                "status" => false,
                "message" => 'Sorry, something went wrong. Please try again later.'
            ];
        } else {
            $response = [
                "status" => true,
                "message" => 'Message sent! Thanks for contacting us.'
            ];
        }
    } else {
        $response = [
            "status" => false,
            "message" => 'Invalid email address, message ignored.'
        ];
    }

    if ($isAjax) {
        header('Content-type:application/json;charset=utf-8');
        echo json_encode($response);
        exit();
    }
}

?>