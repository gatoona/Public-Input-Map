step_one_handler = {

    properties: {
        title: 'Tell Us Where'
    },

    onLoad: function(){

        map.off("draw:created");
        map.off("draw:drawstart");
        map.off("draw:drawstop");

        mapData.drawnItemsLayer.clearLayers();

        var markerDrawActive = mapData.drawControl.marker['_enabled'] || undefined;
        var polylineDrawActive = mapData.drawControl.polyline['_enabled'] || undefined;

        if (markerDrawActive){
            $('.marker-input').addClass('animated bounceIn shake').removeClass('hidden');
        }
        else if (polylineDrawActive){
            $('.route-input').addClass('animated bounceIn shake').removeClass('hidden');
        }
    },

    
    disableDraw: function(){
    	mapData.drawControl.marker.disable();
    	mapData.drawControl.polyline.disable();
    },

    onDrawStart: function(e){
        var self = this;
        var layer = e.layer;
        var type = e.layerType;

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

	    layer.editing.enable();
	    mapData.drawnItemsLayer.addLayer(layer);

        $('#content-root').removeClass('swipe');

	    if (type === "marker") {
            mapData.drawnItemsLayer.getLayers()[0].dragging.enable();
	    }

        if (type === "polyline" || type === "marker") {
            window.location.href = "#/add-feature/";
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
        var self = this;
        $('#content-root').removeClass('swipe');
        self.disableDraw();
        self.hideEdits();
    },

    deleteLastVertex: function(){
        mapData.drawControl.polyline.deleteLastVertex();
    },

    hideEdits: function(){
        $('.route-input').addClass('hidden').removeClass('animated bounceIn shake');
        $('.marker-input').addClass('hidden').removeClass('animated bounceIn shake');

    },


    events: function() {
        var self = this;
        self.onLoad();

        $('.add-marker').click(function(event) {
        	self.disableDraw();

            if (!properties.routeTutorial){
                properties.markerTutorial = true;
                $("#exm1").modal({
                    clickClose: false
                });
            }

        	mapData.drawControl.marker.enable();
            self.hideEdits();
            $('.marker-input').addClass('animated bounceIn shake').removeClass('hidden');
            self.hideContent();
        	return false;
        });

        $('.add-route').click(function(event) {
            self.disableDraw();

            if (!properties.routeTutorial){
                properties.routeTutorial = true;
                $("#ex1").modal({
                    clickClose: false
                });
            }

            mapData.drawControl.polyline.enable();
            self.hideEdits();
            $('.route-input').addClass('animated bounceIn shake').removeClass('hidden');
            self.hideContent();
            return false;
        });

        $('.edit-cancel').click(function(event) {
            self.showContent();
        });

        $('.edit-backspace').click(function(event) {
            self.deleteLastVertex();
        });

        $('.edit-finish').click(function(event) {
            mapData.drawControl.polyline.completeShape();
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