step_two_handler = {

    properties: {
        title: 'Login Page',
        checkInBounds: true,
        key: 'AIzaSyBQOymhaTcHYuGt7Rh8F3M23oNcwKfQm-U'
    },

    onLoad: function(){
        var self = this;
        //Zoom to selected area
        if (self.grabDraw() !== false){
            self.centerDraw();
        }
        $('html, body').animate({ 
           scrollTop: $(document).height()-$(window).height()}, 
           1000, 
           "swing"
        );
    },

    centerDraw: function(){
        var self = this;
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

        else if (layer instanceof L.Polyline){
            // self.snapToRoad(layer);
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

    //functionality to snap roads not quite there yet.
    snapToRoad: function(layer){
        var self = this;
        if (layer){
            var shape = layer.toGeoJSON();
            var polyline = shape.geometry.coordinates;

            if (polyline.length > 0 && polyline.length <= 100){
                $.each( polyline, function( key, value ) {
                    polyline[key] = value.reverse().join(',');
                });
            }
            polyline = polyline.join('|');

            console.log(polyline);

            $.ajax({
                type: "GET",
                url: 'https://roads.googleapis.com/v1/snapToRoads?path='+polyline+'&interpolate=true&key='+self.properties.key,
                cache: false,
                dataType: "json",
                success: function(json) {
                    if (!json.error) {
                        console.log(json);

                        var pointList = [];

                        $.each(json.snappedPoints, function(index, value) {
                            var point = new L.LatLng(value.location.latitude, value.location.longitude);
                            pointList.push(point);
                        });

                        var snappedPolyline = new L.Polyline(pointList, {
                            stroke: true,
                            color: "#8305be",
                            weight: 4,
                            opacity: 1,
                            dashArray: "5,10",
                            smoothFactor: 1,
                            className: 'linePoints'
                        });

                        mapData.drawnItemsLayer.addLayer(snappedPolyline);

                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                }
            });   
        }
        else {
            
        }

    },

    wordCount: function( val ){
        var wom = val.match(/\S+/g);
        return val.length || 0;
        // return wom ? wom.length : 0;
    },

    formatText: function(comment) {
        comment = comment.replace(/(<([^>]+)>)/gi, "");
        if ($.trim(comment).length > 0) {
            return comment;
        }
        return "";
    },

    formSubmit: function(event) {
        $('#submit').prop('disabled', true);

        var self = this;

        var layer = mapData.drawnItemsLayer.getLayers()[0];
        var shape = layer.toGeoJSON();


        var formData = {
            'name': self.formatText($('input[name=name]').val()),
            'comment': self.formatText($('textarea[name=comment]').val()),
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
                $('#submit').prop('disabled', false);
                if (json.error) {
                    alert('server error');

                } else {
                    mapData.drawnItemsLayer.clearLayers();
                    window.location.href = "#/step-three/";
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                $('#submit').prop('disabled', false);
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
            if (wordCount > 500){
                $('.story-word').text('500');
                $(this).addClass('required');
                // $('.story-min').addClass('hidden');
            }
            else {
                $(this).removeClass('required');
                // $('.story-min').removeClass('hidden');
                $('.story-word').text(wordCount);
            }
        });
    }
}