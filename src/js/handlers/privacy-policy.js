privacy_policy_handler = {

    properties: {
        title: 'Privacy Policy'
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