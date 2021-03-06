<?php
/**
 * Created by PhpStorm.
 * User: connor
 * Date: 18/07/2016
 * Time: 02:12
 */

$config = parse_ini_file('../config/qa-config.ini');

define('BASE_URL', 'http://vagrant.learn.jquery.com/wp-admin/admin.php?page=jquery-q-and-a');

$whitelist = array(
    '127.0.0.1',
    '172.27.72.1', // jQuery vagrant box default
    '::1'
);

$isLocalhost = in_array($_SERVER['REMOTE_ADDR'], $whitelist);

if ($isLocalhost) { // dev
    define('CLIENT_ID', '4de131ee094fcf7d829f');
    define('CLIENT_SECRET', '4e0010ae22f59c0a2f58b0c42c7601a558b5c8c1');
} else { //prod
    define('CLIENT_ID', '3abdc7f847c577e30725');
    define('CLIENT_SECRET', 'acbf9ec1fc6064e9d968c34e66ce2e144904e96d');
}

$code = '';

if (isset($_GET['code'])) {
    $code = $_GET['code'];

    $data = 'client_id=' . CLIENT_ID . '&' .
        'client_secret=' . CLIENT_SECRET . '&' .
        'code=' . urlencode($code);

    $ch = curl_init('https://github.com/login/oauth/access_token');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    parse_str($response);
    header('Location: ' . (BASE_URL . '&access-token=' . $access_token));
    exit;
}


?>

<link rel="stylesheet" href="http://vagrant.learn.jquery.com/jquery-wp-content/plugins/jquery-q-and-a-wp/css/style.css" type="text/css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" type="text/css">

<div class="login">
    <div class="login-box">
        <div class="error <?php if ($_GET['error'] === 'TOKEN') { echo 'active'; } ?>">
            Your access token has expired.
        </div>
        <div class="login-button">
            <a href="https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=<?php echo CLIENT_ID ?>">Login Via GitHub <i class="fa fa-github" aria-hidden="true"></i></a>
        </div>
    </div>
</div>
<?php
