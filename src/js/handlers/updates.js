updates_handler = {

    properties: {
        title: 'Contact',
        updateURL: 'config/comments.php/signups/',
        contactURL: 'config/update.php/update'
    },

    onLoad: function(){
        var self = this;
        $('#content-root, #map').addClass('noswipe');
    },

    formSubmit: function(event) {
        $('#submit').prop('disabled', true);

        var self = this;


        var formData = {
            'name': $('input[name=name]').val(),
            'email': $('input[name=email]').val()
        };

        $.ajax({
            type: "POST",
            url: self.properties.updateURL,
            crossDomain: false,
            data: formData,
            success: function(json) {
                window.location.href = "#/";
                return false;
            },
            error: function(xhr, textStatus, errorThrown) {
                $('#submit').prop('disabled', false);
                window.location.href = "#/" + properties.previousURL;

            }
        });



        event.preventDefault();
    },

    events: function() {
        var self = this;
        self.onLoad();

        $("#contact-submit").submit(function(event) {
            self.formSubmit(event);
        });

        $('.content-close-btn').click(function(event) {
            window.location.href = "#/";
            return false;
        });


    }
}