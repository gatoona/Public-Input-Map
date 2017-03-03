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
            var summary = mapData.suggestions[id].comment.substring(0,50) + ' ...';

            $('#nearby-routes').append('<p><a href="/#/view/' + id + '">' + summary + '</a></p>');

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