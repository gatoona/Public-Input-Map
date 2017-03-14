privacy_policy_handler = {

    properties: {
        title: 'Privacy Policy',
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