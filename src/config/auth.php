<?php

//SELECT session_tokens.guid, session_tokens.token, users.email FROM session_tokens LEFT JOIN users ON session_tokens.guid=users.guid WHERE session_tokens.token = '41332f01285995e3b143ebc232e8772f%%%343133333266303132383539393565336231343365626332333265383737326691fce157a6a73ffd2344ef169b6f5990e544fe834e9aff00c122c5cb139e7090';

require_once 'config.php';
$FieldsGET = 'session_tokens.guid, session_tokens.token, session_tokens.expires, session_tokens.signature, users.email';

//Start Login Proccess.
function auth()
{
	//Grab Token if Exists 
	$cookie_name = "tk-auth";
	if(!isset($_COOKIE[$cookie_name])) {
	    $result = 0;
	}

	else
	{
		$queries = [];
		$data = [];
		$data['"token"'] = $_COOKIE[$cookie_name];

		//Check to see if token exists.

		$query = array
		(
			sprintf('SELECT %s FROM %s LEFT JOIN %s ON %s = %s  WHERE %s = ' . "'%s'" . ' LIMIT 1', $GLOBALS['FieldsGET'], $GLOBALS['session_table'], $GLOBALS['users_table'], 'session_tokens.guid', 'users.guid', 'session_tokens.token', $data['"token"']),
		);
		$query = sprintf('%s;', implode(' ', $query));
		$result = ArrestDB::Query($query);

		//If token does not exist return false;
		if (empty($result) === true || empty($result[0]['email']) === true)

		{
			$result = 0;
		}
		//If token does exist check to see if it's valid.
		else
		{

			//Verify the token is authentic by comparing signatures and guid.
			$token = explode("%%%", $data['"token"']);
			$guidMatch = hash_equals($token[0], md5($result[0]['guid']));

			if (count($token) === 2 && $guidMatch){
				
				$tokenB = $token[1];
				$submitted = crypt($tokenB . $GLOBALS['masterPass'], $GLOBALS['sessionKEY']);
				
				//If signature is valid and isn't expired
				if(hash_equals($submitted, $result[0]['signature']) && $GLOBALS['time'] < $result[0]['expires'])
				{
					//Set Global Variables and return true.
					$GLOBALS['guid'] = $result[0]['guid'];
					$GLOBALS['token_validated'] = true;
					$result = 1;;
				}
				else {
					$result = 0;
				}
			}
			else {
				$result = 0;
			}

		}
	}

	return $result;
}

if (isset($_GET['output'])) {
	echo auth();
}


?>