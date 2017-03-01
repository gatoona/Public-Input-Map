<?php

require '../../config/config.php';


ArrestDB::Serve('GET', '/(#any)/', function ($table)
{

	//Grab users
	$query = array
	(
		sprintf('SELECT * FROM "%s" ORDER BY "id" DESC', $table),
	);
	
	$query = sprintf('%s;', implode(' ', $query));
	$data = ArrestDB::Query($query);

	foreach ($data as $id => $value)
	{
		echo '<Placemark>';
		echo '<name>' . $value['name'] . '</name>';
		echo '<description>' . $value['comment'] . '</description>';
		echo '<Point>';
		echo '<coordinates>-122.0822035425683,37.42228990140251,0</coordinates>';
		echo '</Point>';
		echo '</Placemark>';

	}

	return false;
});




exit(ArrestDB::Reply(ArrestDB::$HTTP[400]));

?>