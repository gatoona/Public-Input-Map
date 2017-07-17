<?php
header('Content-Type: application/vnd.google-earth.kml+xml kml');
header('Content-Disposition: attachment; filename="test.kml"');

$dsn = 'sqlite://../../db/data.sqlite';
require '../../config/config.php';


// Print the head of the document
echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<kml xmlns="http://www.opengis.net/kml/2.2">';
echo '<Document>';
echo '<Style id="yellowLineGreenPoly">';
echo '<LineStyle>';
echo '<color>7f00ffff</color>';
echo '<width>1</width>';
echo '</LineStyle>';
echo '<PolyStyle>';
echo '<color>7f00ff00</color>';
echo '</PolyStyle>';
echo '</Style>';


ArrestDB::Serve('GET', '/(#any)/', function ($table)
{

	$query = array
	(
		sprintf('SELECT *, (SELECT COUNT(*) FROM "likes" WHERE "object" = suggestions.id) AS "likes" FROM "suggestions"'),
	);
	
	$query = sprintf('%s;', implode(' ', $query));
	$data = ArrestDB::Query($query);

	foreach ($data as $id => $value)
	{
		$coordinates = json_decode($value['geometry']);

		echo '<Placemark>';
		echo '<name>' . $value['id'] . '</name>';

		echo '<ExtendedData>';
		echo '<Data name="category">';
		echo '<value>'.$value['category'].'</value>';
		echo '</Data>';
		echo '<Data name="added-date">';
		echo '<value>'.$value['created'].'</value>';
		echo '</Data>';
		echo '<Data name="username">';
		echo '<value>'.htmlentities($value['name']).'</value>';
		echo '</Data>';
		echo '<Data name="likes">';
		echo '<value>'.$value['likes'].'</value>';
		echo '</Data>';
		echo '</ExtendedData>';

		echo '<description>' . htmlentities($value['comment']) . '</description>';

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

	// And finish the document

	echo '</Document>';
	echo '</kml>';

});





?>