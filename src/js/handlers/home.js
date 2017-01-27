home_handler = {

    properties: {
        title: 'Login Page'
    },

    onLoad: function(){
        var self = this;
        self.loadData();

    },


    setData: function(){
        $.each(mapData.suggestions, function(index, value) {

            if (mapData.features[value.id] == undefined && value.type == 'Point') {
                var geometry = JSON.parse(value.geometry);
                mapData.features[value.id] = L.marker([ geometry[1], geometry[0] ], {
                    icon: new L.DivIcon()
                });
                mapData.features[value.id].bindPopup('a');
                mapData.pointsLayer.addLayer(mapData.features[value.id]);
            }
            else if (mapData.features[value.id] == undefined && value.type == 'LineString') {
                var geometry = JSON.parse(value.geometry);
                var pointList = [];

                $.each(geometry, function(index, value) {
                    var point = new L.LatLng(value[1], value[0]);
                    pointList.push(point);
                });

                mapData.features[value.id] = new L.Polyline(pointList, {
                    color: 'red',
                    weight: 3,
                    opacity: 0.8,
                    smoothFactor: 1
                });

                mapData.features[value.id].bindPopup('a');

                mapData.pointsLayer.addLayer(mapData.features[value.id]);
            }
        });

        // $(document).on("click", ".comment-btn", function(e) {
        //     var suggestionID = $(this).attr("data");
        //     currentSuggestion = suggestionID;
        //     var content = $("#comments .content");
        //     content.html(fadeIn(mytemplate["templates/comments"]));
        //     content.find("#suggestion-type").text(comments[suggestionID].question);
        //     content.find("#suggestion-comment").text(comments[suggestionID].comment);
        //     map.spin(true);
        //     getComments(suggestionID, content);
        //     $(".li-comments").removeClass("disabled");
        //     sidebar.open("comments");
        // });
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
    }
}