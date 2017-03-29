add_route_handler = {

    properties: {
        title: 'Tell Us Why',
        checkInBounds: true,
        key: 'AIzaSyBQOymhaTcHYuGt7Rh8F3M23oNcwKfQm-U',
        wordLimit: 500
    },

    onLoad: function(){
        var self = this;
        //Zoom to selected area
        if (self.grabDraw() !== false){
            self.centerDraw(mapData.drawnItemsLayer.getLayers()[0]);
        }
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

        var checked = $('.content-error').hasClass('bounceIn');

        if (checked){
            $('.content-error').removeClass('bounceIn').addClass('bounce');
        }
        else {
            $('.content-error').removeClass('hidden bounce').addClass('animated bounceIn');
        }


        mapData.geoJSON.cityBounds.setStyle({
            fillOpacity: 0,
            opacity: 1,
            weight: 5
        });
    },

    onInBounds: function(){
        $('#map').removeClass('boundsError');
        $('.content-error').addClass('hidden').removeClass('animated bounceIn');

        mapData.geoJSON.cityBounds.setStyle({
            fillOpacity: 0,
            opacity: 0,
            weight: 2
        });
    },

    centerDraw: function(layer){
        var self = this;
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

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

        if (layer instanceof L.Polyline) {

            map.fitBounds(layer.getBounds());
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



            $.ajax({
                type: "GET",
                url: 'https://roads.googleapis.com/v1/snapToRoads?path='+polyline+'&interpolate=true&key='+self.properties.key,
                cache: false,
                dataType: "json",
                success: function(json) {
                    if (!json.error) {


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

        var inBounds = self.checkInBounds(mapData.drawnItemsLayer.getLayers()[0], mapData.geoJSON.cityBounds.getLayers()[0]);
        if (inBounds == false){
            self.onOutOfBounds();
        }
        else if (inBounds == true){
            self.onInBounds();
        }

        var underLimit = self.wordCount($('textarea[name=comment]').val()) <= 500;

        if (inBounds && underLimit){

            var layer = mapData.drawnItemsLayer.getLayers()[0];
            var shape = layer.toGeoJSON();


            var formData = {
                'name': self.formatText($('input[name=name]').val()) || 'Anonymous',
                'comment': self.formatText($('textarea[name=comment]').val()),
                'category' : $("select[name=category]").val(),
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
        }
        else {
            $('#submit').prop('disabled', false);
        }


        event.preventDefault();
    },

    events: function() {
        var self = this;
        self.onLoad();

        $("#suggestion-submit").submit(function(event) {
            self.formSubmit(event);
        });

        $('.content-error').click(function(event) {
            $(this).removeClass('animated bounceIn shake').addClass('hidden');
        });


        $('textarea[name=comment]').on('input click', function() {
            var wordCount = self.wordCount($(this).val());
            if (wordCount > self.properties.wordLimit){
                $('.story-word').text(self.properties.wordLimit);
                $(this).addClass('required');
                $('.story-min').addClass('required');
            }
            else {
                $(this).removeClass('required');
                $('.story-min').removeClass('required');
                $('.story-word').text(wordCount);
            }
        });
    }
}