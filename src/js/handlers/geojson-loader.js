geojson_loader_handler = {

    properties: {
    },

    onLoad: function(){
    },

    removeData: function(){
        console.log('removing');
        $.each(mapData.geoJSONData, function(index, value) {
            mapData.geoJSONLayer.removeLayer(mapData.geoJSONLayers[index]);
        });
    },


    loadData: function(data){
        var self = this;

        //Load Bounds
        if (data == 'bounds'){
            if (!mapData.geoJSON.bounds){

                mapData.geoJSONData.bounds = '';
                mapData.geoJSONLayers.bounds = L.featureGroup();
                mapData.geoJSONLayers.bounds.addTo(mapData.geoJSONLayer);

                mapData.geoJSON.bounds = new L.GeoJSON.AJAX(["data/bounds.geojson?ver=wpb"],{
                    clickable: false,
                    onEachFeature: self.geoJSONPopUpBounds,
                    style: {
                        color: '#c2dc77',
                        weight: 2,
                        fillColor: "#1f2552",
                        opacity: 1,
                        fillOpacity: 0,
                        className: "city-bounds"
                    }
                });
                mapData.geoJSON.bounds.on('data:loading', function() {
                    map.spin(true);
                }.bind(this));
                mapData.geoJSON.bounds.on('data:loaded', function() {
                    map.spin(false);
                    if (!properties.loadHashID){
                        setTimeout(function(){
                            map.fitBounds(mapData.geoJSONLayers.bounds.getBounds());
                        }, 500);
                    }
                }.bind(this));
            }
            else {
                mapData.geoJSONLayers.bounds.addTo(mapData.geoJSONLayer);
            }
        }

    },

    geoJSONPopUpBounds: function(f,l){
        var self = this;
        mapData.geoJSONData.bounds = l;
        mapData.geoJSONData.bounds.addTo(mapData.geoJSONLayers.bounds);
    },

    events: function() {
        var self = this;
        self.onLoad();
    }
}