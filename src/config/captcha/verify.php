<?php
	function captchaVerify($code)
	{
		session_start();
		if(isset($code)&&$code!=""&&$_SESSION["code"]==$code)
		{
			session_destroy();
		}
		else
		{
			$result = ArrestDB::$HTTP[captchaFail];
			session_destroy();
			die(ArrestDB::Reply($result));

		}


		// if (isset($_COOKIE['PHPSESSID'])) {
		//     unset($_COOKIE['PHPSESSID']);
		//     setcookie('PHPSESSID', '', time() - 3600, '/'); // empty value and old timestamp
		// }

	}
?>