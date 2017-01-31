step_one_handler = {

    properties: {
        title: 'Login Page'
    },

    onLoad: function(){

        map.off("draw:created");
        map.off("draw:drawstart");
        map.off("draw:drawstop");

    	//Setup Draw
    	mapData.drawControl = new L.Control.Draw({
    	    edit: false,
    	    draw: {
    	        polyline: {
    	            repeatMode: false,
    	            shapeOptions: {
    	                stroke: true,
    	                color: "#000000",
    	                weight: 4,
    	                opacity: 1,
    	                fill: false,
    	                clickable: false
    	            }
    	        },
    	        polygon: false,
    	        circle: false,
    	        rectangle: false,
    	        marker: {
    	            repeatMode: false,
                    icon: mapData.inputMarker
    	        }
    	    }
    	});

    	mapData.drawControl.marker = new L.Draw.Marker(map, mapData.drawControl.options.draw.marker);
    	mapData.drawControl.polyline = new L.Draw.Polyline(map, mapData.drawControl.options.draw.polyline);
    },

    checkInBounds: function(marker, poly) {

        var polyPoints = poly.getLatLngs()[0];
        var inside = false;
        var points;

        if (marker instanceof L.Marker) {
            points = [marker.getLatLng()];
        } else if (marker instanceof L.Path) {
            points = marker.getLatLngs();
        }

        $.each(points, function(index, value) {
            var x = value.lat;
            var y = value.lng;
            inside = false;
            for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
                var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
                var xj = polyPoints[j].lat, yj = polyPoints[j].lng;
                var intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
                if (intersect){
                    inside = !inside;
                };

            }

            if (inside == false){
                return false;
            }

        });

        
        return inside;
    },

    onOutOfBounds: function(){
        $('#map').addClass('boundsError');
        
        mapData.geoJSON.cityBounds.setStyle({
            fillOpacity: 0,
            opacity: 1,
            weight: 5
        });
    },

    onInBounds: function(){
        $('#map').removeClass('boundsError');
        
        mapData.geoJSON.cityBounds.setStyle({
            fillOpacity: 0,
            opacity: 1,
            weight: 2
        });
    },

    disableDraw: function(){
    	mapData.drawControl.marker.disable();
    	mapData.drawControl.polyline.disable();
    },

    onDrawStart: function(e){
	    var layer = e.layer;
	    var type = e.layerType;
        var self = this;

        $('#map').addClass('drawStart');
        self.onInBounds();

	    if (mapData.drawnItemsLayer.getLayers().length > 0) {
	        mapData.drawnItemsLayer.clearLayers();
	    }

	    mapData.drawnItemsLayer.bringToFront();
    },

    onDrawStop: function(e){
        $('#map').removeClass('drawStart');
    },

    onDrawCreated: function(e){
        var self = this;
	    var layer = e.layer;
	    var type = e.layerType;

	    layer.editing.enable();
	    mapData.drawnItemsLayer.addLayer(layer);

	    if (type === "marker") {
	        mapData.drawnItemsLayer.getLayers()[0].dragging.enable();
	    }

        var test = self.checkInBounds(mapData.drawnItemsLayer.getLayers()[0], mapData.geoJSON.cityBounds.getLayers()[0]);
        if (test == false){
            self.onOutOfBounds();
        }
        else if (test == true){
            self.onInBounds();
        }


	    // window.location.href = "/#/step-two/";
    },

    hideContent: function(){
        $('.content-root').addClass('swipe');
        $('.content-arrow').removeClass('hidden').addClass('animated fadeInLeft');
    },

    showContent: function(){
        $('.content-root').removeClass('swipe');
        $('.content-arrow').addClass('hidden').removeClass('animated fadeInLeft');
    },


    events: function() {
        var self = this;
        self.onLoad();

        $('.add-marker').click(function(event) {
        	self.disableDraw();
        	mapData.drawControl.marker.enable();
            self.hideContent();
        	return false;
        });

        $('.add-route').click(function(event) {
        	self.disableDraw();
        	mapData.drawControl.polyline.enable();
            self.hideContent();
        	return false;
        });

        $('.content-arrow').click(function(event) {
            self.showContent();
            self.disableDraw();
            return false;
        });

        map.on("draw:created", function(e) {
        	self.onDrawCreated(e);
        });

        map.on("draw:drawstart", function(e) {
            self.onDrawStart(e);
        });

        map.on("draw:drawstop", function(e) {
            self.onDrawStop(e);
        });

        
    }
}