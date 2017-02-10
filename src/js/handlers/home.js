home_handler = {

    properties: {
        title: 'Welcome'
    },

    onLoad: function(){
        var self = this;
        $(document).off("click", ".like-btn");
        map.off('popupclose');
        map.off('popupopen');
        self.updateLS();
        self.loadData();
    },

    getRequest: function(){
        var self = this;
        var id = properties.loadHashID;

        if (mapData.features[id]){

            var item = mapData.features[id];

            if (item instanceof L.Marker) {

                var itemLocation = mapData.features[id].getLatLng();
                self.onMarkerClick(itemLocation);
                add_point_handler.centerDraw(item);
            }

            else if (item instanceof L.Polyline){
                self.onPolylineClick(mapData.features[id]);
                add_route_handler.centerDraw(item);
            }

            window.location.href = "#/view/" + id;

        }
    },

    //Update Local Storage
    updateLS: function(){
        try {
          mapData.pvlk =  JSON.parse( localStorage.getItem( 'pvlk' ) ) || {};
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
          localStorage.setItem( 'pvlk', JSON.stringify(mapData.pvlk) );
        }
        catch(e) {
          return false;
        }
        self.updateLS();
        return true;
    },

    addLike: function(id){
        var self = this;
        var value = mapData.suggestions[id];

        value.likes = parseInt(value.likes) + 1;
        mapData.features[id]._popup.setContent('<b>By: </b><span class="name">' + value.name + "</span>" + self.fixedComment(value.comment) + '<div class="animated fadeInDown likes">' + self.fixedLikes(value.likes) + '</div>' + self.commentBtn(id));

        self.addLS(id);
        $.ajax({
          type: "PUT",
          url: mapData.suggestionsURL + id,
          data: {
            'likes' : value.likes
          },
          success: function(json) {
            self.addLS(id);
          },
          error: function(xhr, textStatus, errorThrown) {
            console.log(textStatus);
          }
        });
    },


    fixedComment: function(comment) {
        comment = comment.replace(/(<([^>]+)>)/gi, "");
        if ($.trim(comment).length > 0) {
            return '<br><div class="comment"><p>' + comment + '</p></div>';
        }
        return "";
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

    onMarkerClick: function(location){

        var circle = new L.CircleMarker(location, {
            radius: 25,
            fillColor: "#ffe612",
            color: "#000",
            weight: 1,
            opacity: 0,
            fillOpacity: 0.8,
          });

          mapData.selectLayer.addLayer(circle);
    },

    onPolylineClick: function(points){
        var pointList = points.getLatLngs();

        var polyline = new L.Polyline(pointList, {
            stroke: true,
            color: "#ffe612",
            weight: 20,
            opacity: 0.8,
            smoothFactor: 1
        });

        mapData.selectLayer.addLayer(polyline);
        mapData.selectLayer.bringToBack();
    },

    setData: function(){

        var self = this;

        var polylineCategories = {
            "walking-improvement": "#8305be",
            "biking-improvement": "#ff0066"
        };

        $.each(mapData.suggestions, function(index, value) {

            var popUpContent = '<b>By: </b><span class="name">' + value.name + "</span>" + self.fixedComment(value.comment) + '<div class="likes">' + self.fixedLikes(value.likes) + '</div>' + self.likeBtn(value.id) + self.commentBtn(value.id);

            //Point Items
            if (mapData.features[value.id] == undefined && value.type == 'Point') {
                var geometry = JSON.parse(value.geometry);

                mapData.features[value.id] = L.marker([ geometry[1], geometry[0] ], {
                    icon: new L.DivIcon({iconUrl: "img/" + value.category + ".png"})
                }).on('click', function(e) {
                    self.onMarkerClick(e.latlng);
                });

                mapData.features[value.id].bindPopup(popUpContent);
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
                    color: polylineCategories[value.category],
                    weight: 4,
                    opacity: 1,
                    dashArray: "5,10",
                    smoothFactor: 1,
                    className: 'linePoints'
                }).on('click', function(e) {
                    self.onPolylineClick(e.target);
                });

                mapData.features[value.id].bindPopup(popUpContent);
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
            url: mapData.suggestionsURL,
            cache: false,
            dataType: "json",
            success: function(json) {

                $.each(json, function(index, value) {
                    if (index != "error" && mapData.suggestions[value.id] == undefined) {
                        mapData.suggestions[value.id] = value;
                    }
                });
                if ($.isEmptyObject(mapData.suggestions)) {
                    console.log("No Suggestions");
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
    }
}