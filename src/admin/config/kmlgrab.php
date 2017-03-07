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
		$coordinates = json_decode($value['geometry']);

		echo '<Placemark>';
		echo '<name>' . $value['name'] . '</name>';

		echo '<ExtendedData>';
		echo '<Data name="category">';
		echo '<value>'.$value['category'].'</value>';
		echo '</Data>';
		echo '<Data name="added-date">';
		echo '<value>'.$value['created'].'</value>';
		echo '</Data>';
		echo '<Data name="likes">';
		echo '<value>'.$value['likes'].'</value>';
		echo '</Data>';
		echo '<Data name="name">';
		echo '<value>'.$value['name'].'</value>';
		echo '</Data>';
		echo '</ExtendedData>';

		echo '<description>' . $value['comment'] . '</description>';

		if ($value['type'] == 'Point')
		{
			echo '<Point>';
			echo '<coordinates>'.$coordinates[0].','.$coordinates[1].'</coordinates>';
			echo '</Point>';
		}
		else if ($value['type'] == 'LineString')
		{
			echo '<LineString>';
			echo '<coordinates>';
			
			foreach ($coordinates as $id => $coordinate)
			{
				echo $coordinate[0] . ',' . $coordinate[1] . ' ';
			}
			echo '</coordinates>';
			echo '</LineString>';
		}

		echo '</Placemark>';

	}

	return false;
});




exit(ArrestDB::Reply(ArrestDB::$HTTP[400]));

?>