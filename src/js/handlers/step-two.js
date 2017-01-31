step_two_handler = {

    properties: {
        title: 'Login Page',
        checkInBounds: true
    },

    onLoad: function(){
        var self = this;
        //Zoom to selected area
        if (self.grabDraw() !== false){
            self.centerDraw();
        }
    },

    centerDraw: function(){
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        var layer = mapData.drawnItemsLayer.getLayers()[0];

        var getHeaderWidth = function() {
            var totalWidth = 0;
            $(".content-root").each(function() {
                if ($(this).hasClass("hidden")) {} else {
                    totalWidth = $(this).outerWidth(true);
                }
            });
            return totalWidth;
        };

        var getHeaderHeight = function() {
            var totalHeight = 0;
            $(".content-root").each(function() {
                if ($(this).hasClass("hidden")) {} else {
                    totalHeight = $(this).outerHeight(true);
                }
            });
            return totalHeight;
        };

        if (layer instanceof L.Marker) {

            if (windowWidth >= 768) {
                var targetPoint = map.project(layer.getLatLng(), 17).subtract([ getHeaderWidth() / 2, 0 ]);
            } else {
                var targetPoint = map.project(layer.getLatLng(), 17).add([ 0, windowHeight * 0.15 ]);
            }

            var targetLatLng = map.unproject(targetPoint, 17);
            map.setView(targetLatLng, 17);

        }
        
    },

    grabDraw: function(){
        var layer = mapData.drawnItemsLayer.getLayers()[0];

        if (layer){
            var shape = layer.toGeoJSON();
            var shape_for_db = JSON.stringify(shape);
            return shape_for_db;
        }
        else {
            return false;
        }
    },

    wordCount: function( val ){
        var wom = val.match(/\S+/g);
        return wom ? wom.length : 0;
    },

    formSubmit: function(event) {

        var self = this;

        var layer = mapData.drawnItemsLayer.getLayers()[0];
        var shape = layer.toGeoJSON();


        var formData = {
            'name': $('input[name=name]').val(),
            'comment': $('textarea[name=comment]').val(),
            created: 'date',
            type: shape.geometry.type,
            geometry: JSON.stringify(shape.geometry.coordinates)
        };

        $.ajax({
            type: "POST",
            url: mapData.suggestionsURL,
            crossDomain: false,
            data: formData,
            success: function(json) {
                if (json.error) {
                    alert('server error');

                } else {
                    mapData.drawnItemsLayer.clearLayers();
                    window.location.href = "#/step-three/";
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                alert('error');

            }
        });


        event.preventDefault();
    },

    events: function() {
        var self = this;
        self.onLoad();

        $("#suggestion-submit").submit(function(event) {
            self.formSubmit(event);
        });


        $('textarea[name=comment]').on('input click', function() {
            var wordCount = self.wordCount($(this).val());
            if (wordCount >= 100){
                // $(this).removeClass('required');
                // $('.story-min').addClass('hidden');
            }
            else {
                // $(this).addClass('required');
                // $('.story-min').removeClass('hidden');
                $('.story-word').text(wordCount);
            }
        });
    }
}