legend_handler = {

    properties: {
        title: 'Map Legend',
        featureID: ''
    },

    onLoad: function(){
        var self = this;
        $('#content-root').addClass('noswipe');
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