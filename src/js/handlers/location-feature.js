location_feature_handler = {

    properties: {
        navigation: navigator.geolocation,
        watchNavigation: '',
        locationOptions: {
            enableHighAccuracy: true,
            timeout: 27000,
            maximumAge: 30000
        }
    },

    stopLocation: function(){
        var self = this;
        mapData.userLocationLayer.clearLayers(); 
        $( ".location-toggle").removeClass('searching location-found');
        self.properties.navigation.clearWatch(self.properties.watchNavigation);
    },

    showLocation: function(position){

        mapData.userLocationLayer.clearLayers(); 
        var latlng = L.latLng(position.coords.latitude, position.coords.longitude);
        var userLocation =new L.Circle(latlng, position.coords.accuracy, {
            fillColor: "#45c4de",
            color: "#000",
            weight: 1,
            opacity: 0,
            fillOpacity: 0.2,
            className: "user-location",
            clickable: false
        });

        var myIcon = L.divIcon({
            className: 'leaflet-pulsing-icon',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });

        var centerDot = L.marker(latlng, {
            icon: myIcon,
            clickable: false
        });

        mapData.userLocationLayer.addLayer(centerDot);
        mapData.userLocationLayer.addLayer(userLocation);
        home_handler.centerDraw(userLocation);
        $( ".location-toggle").addClass('location-found');
    },

    errorLocation: function(error){
        if (error){
            var errorMessage = "An unknown error occurred.";
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    errorMessage = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    errorMessage = "An unknown error occurred."
                    break;
            }

            alert(errorMessage);
        }
        location_feature_handler.stopLocation();
    },

    startLocation: function(){

        var self = this;
        var isSearching = $( ".location-toggle").hasClass('searching');

        if (!isSearching){
            $( ".location-toggle").addClass('searching');


            if (self.properties.navigation) {
                self.properties.watchNavigation = self.properties.navigation.watchPosition(self.showLocation, self.errorLocation, self.properties.locationOptions);
                
            } else {
                self.errorLocation();
            }

        }
        else{
            self.stopLocation();
        }

        

        
    },


    events: function() {
        var self = this;
    }
}