step_three_handler = {

    properties: {
        title: 'Login Page'
    },

    onLoad: function(){
        var self = this;
        home_handler.updateLS();
        home_handler.loadData();
        $('#map').removeClass('drawStart');
    },

    events: function() {
        var self = this;
        self.onLoad();


    }
}