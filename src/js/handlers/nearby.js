nearby_handler = {

    properties: {
        title: 'Nearby'
    },

    onLoad: function(){
        var self = this;
        $('#content-root').addClass('noswipe');

        self.updateNearbyRoutes();

    },

    updateNearbyRoutes: function(){
        $('#nearby-routes').html('');
        $.each(mapData.nearbyRoutes, function(index, value) {

            var id = value.layer.options.id;
            var category = mapData.suggestions[id].category;

            var comment = mapData.suggestions[id].comment;
            var summary = properties.selectCategories[category].title;
            var name = mapData.suggestions[id].name;

            if (comment){
                summary = (comment.length >= 50) ? comment.substring(0,50) + '...' : comment;
                summary = '"' + summary + '"';
            }

            $('#nearby-routes').append('<p><a href="#/view/' + id + '">Route ID '+ id +':</a> ' + summary + ' - '+ name +'</p>');

        });

    },

    events: function() {
        var self = this;
        self.onLoad();


        $('.content-close-btn').click(function(event) {
            window.location.href = "#/" + properties.previousURL;
            return false;
        });


    }
}