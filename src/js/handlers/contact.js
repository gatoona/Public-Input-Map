contact_handler = {

    properties: {
        title: 'Contact Us',
        contactURL: 'config/contact.php/contact'
    },

    onLoad: function(){
        var self = this;
        $('#content-root, #map').addClass('noswipe');
    },

    formSubmit: function(event) {
        $('#submit').prop('disabled', true);

        var self = this;


        var formData = {
            'email': $('input[name=email]').val(),
            'comment': $('textarea[name=comment]').val()
        };

        $.ajax({
            type: "POST",
            url: self.properties.contactURL,
            crossDomain: false,
            data: formData,
            success: function(json) {
                window.location.href = "#/" + properties.previousURL;
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
            window.location.href = "#/" + properties.previousURL;
            return false;
        });


    }
}