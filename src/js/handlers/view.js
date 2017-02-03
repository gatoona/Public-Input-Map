view_handler = {

    properties: {
        title: 'View/Add Comments',
        featureID: ''
    },

    onLoad: function(){
        var self = this;

        self.properties.featureID = window.location.hash.substring(2).split('/')[1];
        //check to see if this feature exists
        if (!mapData.suggestions[self.properties.featureID]){
            window.location.href = "#/";
        }

        //Save last url before coming into view
        if (properties.previousURL != 'view'){
            properties.savedURL = properties.previousURL;
        }


    },

    getData: function(){
        var self = this;
        var data = mapData.suggestions[self.properties.featureID];
        //Set Suggestion's initial comment
        $('.suggestion-comment').html('<p class="no-mp">"' + data.comment + '" - <b>'+data.name+'</b></p>');
        self.getComments();

    },

    formatText: function(comment) {
        comment = comment.replace(/(<([^>]+)>)/gi, "");
        if ($.trim(comment).length > 0) {
            return comment;
        }
        return "";
    },

    wordCount: function( val ){
        var wom = val.match(/\S+/g);
        return val.length || 0;
        // return wom ? wom.length : 0;
    },

    getComments: function(){

        var self = this;
        $('.comments').html('');

        //Set Comments
        $.ajax({
            type: "GET",
            url: mapData.commentsURL + '?sid=' + self.properties.featureID,
            cache: false,
            dataType: "json",
            success: function(json) {

                if (!json.error) {

                    $.each(json, function(index, value) {
                        $('.comments').append('<p>"'+value.comment+'" - <b>'+value.name+'</b></p>')
                    });

                }
                else {
                    $('.comments').addClass('hidden');
                }

            },
            error: function(xhr, textStatus, errorThrown) {
            }
        });

    },

    formSubmit: function(event) {
        $('#submit').prop('disabled', true);

        var self = this;

        var formData = {
            'name': self.formatText($('input[name=name]').val()),
            'comment': self.formatText($('textarea[name=comment]').val()),
            'sid': self.properties.featureID
        };

        $.ajax({
            type: "POST",
            url: mapData.commentsURL,
            crossDomain: false,
            data: formData,
            success: function(json) {
                $('#submit').prop('disabled', false);
                if (json.error) {
                    alert('server error');

                } else {
                    $("#comment-submit").fadeOut('500', function() {
                        $("#comment-submit").remove();
                        self.getComments();
                        $('.comments').addClass('expanded').removeClass('hidden');

                    });
                    // window.location.href = "#/step-three/";
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                $('#submit').prop('disabled', false);
                alert('error');
            }
        });


        event.preventDefault();
    },

    events: function() {
        var self = this;
        self.onLoad();
        self.getData();

        $("#comment-submit").submit(function(event) {
            self.formSubmit(event);
        });

        $('.content-close-btn').click(function(event) {
            map.closePopup();
            window.location.href = "#/" + properties.savedURL;
            return false;
        });

        $('textarea[name=comment]').on('input click', function() {
            var wordCount = self.wordCount($(this).val());
            if (wordCount > 300){
                $('.story-word').text('300');
                $(this).addClass('required');
                // $('.story-min').addClass('hidden');
            }
            else {
                // $(this).addClass('required');
                $(this).removeClass('required');
                $('.story-word').text(wordCount);
            }
        });


    }
}