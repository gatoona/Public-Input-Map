step_one_handler = {

    properties: {
        title: 'Login Page'
    },

    onLoad: function(){

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
    	                clickable: false,
    	                dashArray: "10,5"
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

    disableDraw: function(){
    	mapData.drawControl.marker.disable();
    	mapData.drawControl.polyline.disable();
    },

    onDrawStart: function(e){
	    var layer = e.layer;
	    var type = e.layerType;

	    if (mapData.drawnItemsLayer.getLayers().length > 0) {
	        mapData.drawnItemsLayer.clearLayers();
	    }

	    mapData.drawnItemsLayer.bringToFront();
    },

    onDrawCreated: function(e){
	    var layer = e.layer;
	    var type = e.layerType;

	    layer.editing.enable();
	    mapData.drawnItemsLayer.addLayer(layer);

	    if (type === "marker") {
	        mapData.drawnItemsLayer.getLayers()[0].dragging.enable();
	    }

	    window.location.href = "/#/step-two/";
    },


    events: function() {
        var self = this;
        self.onLoad();

        $('.add-marker').click(function(event) {
        	self.disableDraw();
        	mapData.drawControl.marker.enable();
        	return false;
        });

        $('.add-route').click(function(event) {
        	self.disableDraw();
        	mapData.drawControl.polyline.enable();
        	return false;
        });

        map.on("draw:created", function(e) {
        	map.off("draw:created");
        	self.onDrawCreated(e);
        });

        map.on("draw:drawstart", function(e) {
        	map.off("draw:drawstart");
            self.onDrawStart(e);
        });

        
    }
}