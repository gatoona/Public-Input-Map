view_handler = {

    properties: {
        title: 'View/Add Comments',
        featureID: '',
        wordLimit: 300
    },

    onLoad: function(){
        var self = this;
        $('#content-root, #map').addClass('noswipe');
        
        self.properties.featureID = window.location.hash.substring(2).split('/')[1];
        var id = self.properties.featureID;

        mapData.selectLayer.clearLayers();
        map.closePopup();

        //check to see if this feature exists
        if (!mapData.featuresData[self.properties.featureID]){
            window.location.href = "#/";
        }
        else {


            var item = mapData.features[id];
            if (item instanceof L.Marker) {
                home_handler.onMarkerClick(item);
                home_handler.centerDraw(item);
            }

            else if (item instanceof L.Polyline){
                home_handler.onPolylineClick(undefined, item);
                home_handler.centerDraw(item);
            }

            map.invalidateSize();
            self.getData();
        }



    },

    getData: function(){
        var self = this;
        var data = mapData.featuresData[self.properties.featureID];
        var category = properties.selectCategories[data.category] ? properties.selectCategories[data.category].title : '';

        data.comment = data.comment || category;
        //Set Suggestion's initial comment
        if (data.comment){
            $('.suggestion-comment').html('<p class="no-mp">"' + data.comment + '" - <b>'+data.name+'</b></p>').removeClass('hidden');
        }

        self.getLikes();
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

    getLikes: function(){
        var self = this;
        var id = self.properties.featureID;

        if (id){
            var likesNum = mapData.featuresData[id].likes;
            $('.view-like').html(home_handler.fixedLikes(likesNum) + self.likeBtn(id)).removeClass('hidden');
            $('.add-like').click(function(event) {
                home_handler.addLike(id);
                event.preventDefault();
            });
        }
    },

    likeBtn: function(marker) {
        if (marker in mapData.pvlk){
          return '';
        }
        else {
          return ' / <a class="add-like" href="#">Like This</a>'
        }
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