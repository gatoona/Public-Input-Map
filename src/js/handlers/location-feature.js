location_feature_handler = {

    properties: {
    },

    grabLocation: function(){

        var self = this;
        $( ".location-toggle").addClass('searching');
        mapData.userLocationLayer.clearLayers(); 

        
        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        var stopRotating = function(){
            $( ".location-toggle").removeClass('searching');
        };

        var showPosition = function(position){
            stopRotating();

            var latlng = L.latLng(position.coords.latitude, position.coords.longitude);


            var userLocation =new L.Circle(latlng, position.coords.accuracy, {
                fillColor: "#45c4de",
                color: "#000",
                weight: 1,
                opacity: 0,
                fillOpacity: 0.3,
                className: "user-location"
            });

            var myIcon = L.divIcon({
                className: 'leaflet-pulsing-icon',
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            });
            var centerDot = L.marker(latlng, {
                icon: myIcon,
            });

            mapData.userLocationLayer.addLayer(centerDot);
            mapData.userLocationLayer.addLayer(userLocation);
            home_handler.centerDraw(userLocation);

        }

        var error = function(error){
            stopRotating();
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, error, options);
            
        } else {
            stopRotating();
            alert("Unable to get GPS location.");
        }
    },


    events: function() {
        var self = this;
        self.onLoad();

    }
}