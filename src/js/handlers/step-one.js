step_one_handler = {

    properties: {
        title: 'Tell Us Where'
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
    	                color: "#8305be",
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

        mapData.drawnItemsLayer.clearLayers();
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
        var self = this;

        map.closePopup();

        $('#map').addClass('drawStart');

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

        console.log(type);

	    layer.editing.enable();
	    mapData.drawnItemsLayer.addLayer(layer);

        $('#content-root').removeClass('swipe');

	    if (type === "marker") {

            mapData.drawnItemsLayer.getLayers()[0].dragging.enable();
            window.location.href = "#/add-point/";
	    }

        else if (type === "polyline") {
            window.location.href = "#/add-route/";
        }

    },

    hideContent: function(){
        $('#content-root').addClass('swipe');
        $('html, body').animate({ 
           scrollTop: 0}, 
           1000, 
           "swing"
        );
    },

    showContent: function(){
        $('#content-root').removeClass('swipe');
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