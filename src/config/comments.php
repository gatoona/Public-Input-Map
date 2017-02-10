<?php
require 'config.php';
$FieldsGET = 'id, name, comment, likes, type, geometry, category';


ArrestDB::Serve('GET', '/(#any)/', function ($table)
{

	if ($table == 'comments'){
		$GLOBALS['FieldsGET'] = 'id, name, comment, created';
	}

	$query = array
	(
		sprintf('SELECT %s FROM "%s"',$GLOBALS['FieldsGET'], $table),
	);


	if (isset($_GET['sid']) === true)
	{
		$query[] = sprintf('WHERE sid = ' . "'%s'" . '', $_GET['sid']);
		$query[] = sprintf('ORDER BY "%s" %s', 'created', 'DESC');
	}

	$query = sprintf('%s;', implode(' ', $query));
	$result = ArrestDB::Query($query);

	if ($result === false)
	{
		$result = ArrestDB::$HTTP[404];
	}
	else if (empty($result) === true)
	{
		$result = ArrestDB::$HTTP[204];
	}

	return ArrestDB::Reply($result);
});


ArrestDB::Serve('POST', '/(#any)', function ($table)
{
	if (empty($_POST) === true)
	{
		$result = ArrestDB::$HTTP[204];
	}

	else if (is_array($_POST) === true)
	{
		$queries = [];

		if (count($_POST) == count($_POST, COUNT_RECURSIVE))
		{
			$_POST = [$_POST];
		}

		foreach ($_POST as $row)
		{
			$data = [];

			foreach ($row as $key => $value)
			{
				$data[sprintf('"%s"', $key)] = $value;
			}

			$data['"created"'] = $GLOBALS['time'];
			$data['"uip"'] = $_SERVER['REMOTE_ADDR'];
			$data['"uipp"'] = $_SERVER['HTTP_X_FORWARDED_FOR'];



			$query = array
			(
				sprintf('INSERT INTO "%s" (%s) VALUES (%s)', $table, implode(', ', array_keys($data)), implode(', ', array_fill(0, count($data), '?'))),
			);

			$queries[] = array
			(
				sprintf('%s;', implode(' ', $query)),
				$data,
			);
		}

		if (count($queries) > 1)
		{
			ArrestDB::Query()->beginTransaction();

			while (is_null($query = array_shift($queries)) !== true)
			{
				if (($result = ArrestDB::Query($query[0], $query[1])) === false)
				{
					ArrestDB::Query()->rollBack(); break;
				}
			}

			if (($result !== false) && (ArrestDB::Query()->inTransaction() === true))
			{
				$result = ArrestDB::Query()->commit();
			}
		}

		else if (is_null($query = array_shift($queries)) !== true)
		{
			$result = ArrestDB::Query($query[0], $query[1]);
		}

		if ($result === false)
		{
			$result = ArrestDB::$HTTP[409];
		}

		else
		{
			$result = ArrestDB::$HTTP[201];
		}
	}

	return ArrestDB::Reply($result);
});


ArrestDB::Serve('PUT', '/(#any)/(#num)', function ($table, $id)
{	

	// Grab Current Likes
	$query = array
	(
		sprintf('SELECT %s FROM "%s"', 'likes', $table),
	);
	if (isset($id) === true)
	{
		$query[] = sprintf('WHERE "%s" = ? LIMIT 1', 'id');
	}
	$query = sprintf('%s;', implode(' ', $query));
	$result = (isset($id) === true) ? ArrestDB::Query($query, $id) : ArrestDB::Query($query);

	if (empty($GLOBALS['_PUT']) === true)
	{
		$result = ArrestDB::$HTTP[204];
	}
	else if (is_array($GLOBALS['_PUT']) === true)
	{

		if (is_numeric($result[0]['likes'])){
			$GLOBALS['_PUT']['likes'] = $result[0]['likes'] + 1;
		}
		else {
			unset($GLOBALS['_PUT']['likes']);
		}


		foreach ($GLOBALS['_PUT'] as $key => $value)
		{
			$data[$key] = sprintf('"%s" = ?', $key);
		}



		$query = array
		(
			sprintf('UPDATE "%s" SET %s WHERE "%s" IN (%s)', $table, implode(', ', $data), 'id', $id),
		);

		$query = sprintf('%s;', implode(' ', $query));

		$result = ArrestDB::Query($query, $GLOBALS['_PUT']);

		if ($result === false)
		{
			$result = ArrestDB::$HTTP[409];
		}

		else
		{
			$result = ArrestDB::$HTTP[200];
		}
	}

	return ArrestDB::Reply($result);
});


exit(ArrestDB::Reply(ArrestDB::$HTTP[400]));
?>