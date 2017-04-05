home_handler = {

    properties: {
        title: 'Public Input Map Demo'
    },

    onLoad: function(){
        var self = this;

        $('#content-root').removeClass('swipe');
        mapData.drawnItemsLayer.clearLayers();
        step_one_handler.showContent();

        $(document).off("click", ".like-btn");
        map.off('popupclose');
        map.off('popupopen');
        
        self.disableRouteEasyClick();

        self.updateLS();
        self.loadData();
    },

    scrollTop: function(){
        $('html, body').animate({ 
           scrollTop: 0}, 
           800, 
           "swing"
        );
    },

    scrollContent: function(){
        $('html, body').animate({ 
           scrollTop: $('.content-root').offset().top}, 
           800, 
           "swing"
        );
    },

    getRequest: function(){
        var self = this;
        var id = properties.loadHashID;

        if (mapData.features[id]){

            window.location.href = "#/view/" + id;

        }
    },

    //Update Local Storage
    updateLS: function(){
        try {
          mapData.pvlk =  JSON.parse( localStorage.getItem( 'pvlk-map-demo' ) ) || {};
        }
        catch(e) {
          console.log(e);
        }
    },

    //Add to Local Storage
    addLS: function(id){
        var self = this;
        var pg = {};

        pg.ID = id || null;
        
        if (!mapData.pvlk){
          mapData.pvlk = {}
        }

        if (pg.ID){
          mapData.pvlk[pg.ID] = pg;
        }

        try {
          localStorage.setItem( 'pvlk-map-demo', JSON.stringify(mapData.pvlk) );
        }
        catch(e) {
          return false;
        }
        self.updateLS();
        return true;
    },

    addLike: function(id){

        var self = this;
        var value = mapData.featuresData[id];

        $.ajax({
          type: "POST",
          url: mapData.likesURL,
          data: {
            'object': id,
            'type': 'feature'
          },
          success: function(json) {
            value.likes = parseInt(value.likes) + 1;
            self.addLS(id);

            //Update popup content
            mapData.features[id]._popup.setContent('<b>By: </b><span class="name">' + value.name + "</span>" + self.fixedComment(value.comment, value.category) + '<div class="animated fadeInDown likes">' + self.fixedLikes(value.likes) + '</div>' + self.commentBtn(id));
            //update view content
            view_handler.getLikes();

          },
          error: function(xhr, textStatus, errorThrown) {
            console.log(textStatus);
          }
        });
    },


    fixedComment: function(comment, category) {
        comment = comment.replace(/(<([^>]+)>)/gi, "");

        if ($.trim(comment).length == 0) {
            comment = properties.selectCategories[category].title;
        }
        return '<br><div class="comment"><p>"' + comment + '"</p></div>';
    },

    fixedLikes: function(likes) {
        if (likes == 1) {
            return "1 person likes this.";
        } else if (likes > 1) {
            return likes + " people like this.";
        }
        else  if (likes == 0){
          return "No one has liked this."
        }
    },

    likeBtn: function(marker) {
        if (marker in mapData.pvlk){
          return '';
        }
        else {
          return '<button class="inline-block like-btn" marker="'+marker+'" >Like this</button> '
        }
    },

    commentBtn: function(marker) {
        return '<a class="inline-block btn-novel" href="#/view/'+marker+'" >Comment</a>';
    },

    onMarkerClick: function(marker){
        var location = marker.getLatLng();
       
       var circle = new L.CircleMarker(location, {
            radius: 25,
            fillColor: "#ffe612",
            color: "#000",
            weight: 1,
            opacity: 0,
            fillOpacity: 0.8,
            clickable: false
        });

        mapData.selectLayer.addLayer(circle);
    },

    onPolylineClick: function(clickArea, polyline){

        var points = polyline.getLatLngs();

        function highlightSelected(){

            var polylineSelect = new L.Polyline(points, {
                stroke: true,
                color: "#ffe612",
                weight: 15,
                opacity: 0.8,
                smoothFactor: 1,
                clickable: false
            });

            mapData.selectLayer.addLayer(polylineSelect);
            mapData.selectLayer.bringToFront();
            polyline.bringToFront();
        }


        if (clickArea !== undefined && (map.getZoom() > 13)){
            var layersWithin = L.GeometryUtil.layersWithin(map, mapData.lineStringLayer.getLayers(), clickArea, 20);

            highlightSelected();

            if (layersWithin.length > 1){
                mapData.nearbyRoutes = layersWithin;
                window.location.href = "#/nearby";

                if (properties.currentURL == 'nearby'){
                    nearby_handler.updateNearbyRoutes();
                }


            }

            else if (layersWithin.length == 1){


                if (properties.currentURL == 'nearby'){
                    $('#content-root').removeClass('noswipe');
                    window.location.href = "#/" + properties.previousURL;
                }


            }
        }
        else {
           highlightSelected(); 
        }

    },

    enableRouteEasyClick: function(){

        var self = this;

        map.on("click", function(e) {

            //Check to see if draw is enabled.
            var markerDrawActive = mapData.drawControl.marker['_enabled'] || undefined;
            var polylineDrawActive = mapData.drawControl.polyline['_enabled'] || undefined;

            var clickedArea = e.latlng;
            var closestLayer = L.GeometryUtil.closestLayer(map, mapData.lineStringLayer.getLayers(), e.latlng);
            
            //If a close layer exists and draw is disabled, execute.
            if (closestLayer && markerDrawActive != true && polylineDrawActive != true) {
                if (closestLayer.distance <= 20){
                    var closest = L.GeometryUtil.closest(map, closestLayer.layer, e.latlng, false);
                    var latlng = L.latLng(closest.lat, closest.lng);
                    self.onPolylineClick(latlng, closestLayer.layer);
                    closestLayer.layer.openPopup(latlng);
                }
            }
        });

    },


    disableRouteEasyClick: function(){
        map.off("click");
    },

    generatePopUp: function(value){
        var self = this;
        return '<b>By: </b><span class="name">' + value.name + "</span>" + self.fixedComment(value.comment, value.category) + '<div class="likes">' + self.fixedLikes(value.likes) + '</div>' + self.likeBtn(value.id) + self.commentBtn(value.id);
    },

    setData: function(){

        var self = this;

        $.each(mapData.featuresData, function(index, value) {

            //Point Items
            if (mapData.features[value.id] == undefined && value.type == 'Point') {
                var geometry = JSON.parse(value.geometry);

                mapData.features[value.id] = L.marker([ geometry[1], geometry[0] ], {
                    icon: new L.DivIcon({iconUrl: "img/legend/" + value.category + ".png"})
                }).on('click', function(e) {
                    self.onMarkerClick(e.target);
                });

                mapData.features[value.id].bindPopup(self.generatePopUp(value));
                mapData.pointsLayer.addLayer(mapData.features[value.id]);
            }

            //Polyline Items
            else if (mapData.features[value.id] == undefined && value.type == 'LineString') {
                var geometry = JSON.parse(value.geometry);
                var pointList = [];

                $.each(geometry, function(index, value) {
                    var point = new L.LatLng(value[1], value[0]);
                    pointList.push(point);
                });

                mapData.features[value.id] = new L.Polyline(pointList, {
                    stroke: true,
                    color: properties.selectCategories[value.category].color,
                    weight: 4,
                    opacity: 1,
                    dashArray: "5,10",
                    smoothFactor: 1,
                    className: 'linePoints',
                    id: value.id
                }).on('click', function(e) {
                    self.onPolylineClick(e.latlng, e.target);
                });

                mapData.features[value.id].bindPopup(self.generatePopUp(value));
                mapData.lineStringLayer.addLayer(mapData.features[value.id]);
            }
        });

        if (properties.loadHash == 'view'){
            properties.loadHash = '';
            self.getRequest();
        }

    },

    loadData: function(){

        var self = this;

        $.ajax({
            type: "GET",
            url: mapData.featuresURL,
            cache: false,
            dataType: "json",
            success: function(json) {

                $.each(json, function(index, value) {
                    if (index != "error" && mapData.featuresData[value.id] == undefined) {
                        mapData.featuresData[value.id] = value;
                    }
                });
                if ($.isEmptyObject(mapData.featuresData)) {
                    console.log("No featuresData");
                } else {
                    self.setData();
                }

            },
            error: function(xhr, textStatus, errorThrown) {
            }
        });
    },


    events: function() {
        var self = this;
        self.onLoad();

        $(document).on("click", ".like-btn", function(event){
            var id = $(this).attr('marker');
            self.addLike(id);
        });

        map.on("popupclose", function() {
            var selectLayer = mapData.selectLayer.getLayers();
            $.each( selectLayer, function( key, value ) {
                if (key == 0 || key < (selectLayer.length - 1)){
                    mapData.selectLayer.removeLayer(value);
                }
            });
        });

        map.on("popupopen", function() {
            var selectLayer = mapData.selectLayer.getLayers();
            $.each( selectLayer, function( key, value ) {
                if (key < (selectLayer.length - 1)){
                    mapData.selectLayer.removeLayer(value);
                }
            });
        });

        self.enableRouteEasyClick();

    }
}