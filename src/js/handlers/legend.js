legend_handler = {

    properties: {
        title: 'Map Legend'
    },

    onLoad: function(){
        var self = this;
        $('#content-root, #map').addClass('noswipe');
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