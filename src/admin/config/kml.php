<?php
header('Content-Type: application/vnd.google-earth.kml+xml kml');
header('Content-Disposition: attachment; filename="test.kml"');

require '../../config/config.php';


// Print the head of the document
echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<kml xmlns="http://www.opengis.net/kml/2.2">';
echo '<Document>';


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

	// And finish the document

	echo '</Document>';
	echo '</kml>';

});





?>