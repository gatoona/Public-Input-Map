<?php
require 'config.php';

// Get Rewards List
ArrestDB::Serve('GET', '/(#any)/', function ($table)
{

	$query = array
	(
		sprintf('SELECT * FROM "%s"', $table),
	);

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

			$time = time();

			$uipp = $_SERVER['HTTP_X_FORWARDED_FOR'];
			$uip = $_SERVER['REMOTE_ADDR'];

			$data['"uip"'] = $uip;
			$data['"uipp"'] = $uipp;



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

exit(ArrestDB::Reply(ArrestDB::$HTTP[400]));
?>