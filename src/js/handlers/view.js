view_handler = {

    properties: {
        title: 'View/Add Comments',
        featureID: '',
        wordLimit: 300
    },

    categories: {
        "walking-obstacle" : "Obstacle for walking.",
        "bicycling-obstacle": "Obstacle for biking.",
        "like-walk": "Nice place to walk.",
        "like-bike": "Nice place to bike.",
        "walking-improvement": "Route Needs Improvement (Walking).",
        "biking-improvement": "Route Needs Improvement (Biking)."
    },

    onLoad: function(){
        var self = this;
        $('#content-root').addClass('noswipe');
        
        self.properties.featureID = window.location.hash.substring(2).split('/')[1];
        //check to see if this feature exists
        if (!mapData.suggestions[self.properties.featureID]){
            window.location.href = "#/";
        }
        else {
            self.getData();
        }


    },

    getData: function(){
        var self = this;
        var data = mapData.suggestions[self.properties.featureID];
        data.comment = data.comment || self.categories[data.category];
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

                console.log(json);

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
        var underLimit = self.wordCount($('textarea[name=comment]').val()) <= self.properties.wordLimit;


        if (underLimit){
            var formData = {
                'name': self.formatText($('input[name=name]').val()) || 'Annonymous',
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
        }
        else {
            $('#submit').prop('disabled', false);
        }


        event.preventDefault();
    },

    events: function() {
        var self = this;
        self.onLoad();

        $("#comment-submit").submit(function(event) {
            self.formSubmit(event);
        });

        $('.content-close-btn').click(function(event) {
            map.closePopup();
            mapData.selectLayer.clearLayers();
            window.location.href = "#/" + properties.previousURL;
            return false;
        });

        $('textarea[name=comment]').on('input click', function() {
            var wordCount = self.wordCount($(this).val());
            if (wordCount > self.properties.wordLimit){
                $('.story-word').text(self.properties.wordLimit);
                $(this).addClass('required');
                $('.story-min').addClass('required');
            }
            else {
                $('.story-min').removeClass('required');
                $(this).removeClass('required');
                $('.story-word').text(wordCount);
            }
        });


    }
}