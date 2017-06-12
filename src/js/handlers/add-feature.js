add_feature_handler = {

    properties: {
        title: 'Tell Us Why',
        checkInBounds: true,
        key: 'AIzaSyBQOymhaTcHYuGt7Rh8F3M23oNcwKfQm-U',
        wordLimit: 500
    },

    onLoad: function(){
        var self = this;
        //Zoom to selected area
        if (home_handler.grabDraw() !== false){
            home_handler.centerDraw(mapData.drawnItemsLayer.getLayers()[0]);
        }

        $('.input-marker').addClass('blink_me');
    },

    wordCount: function( val ){
        var wom = val.match(/\S+/g);
        return val.length || 0;
        // return wom ? wom.length : 0;
    },

    formatText: function(comment) {
        comment = comment.replace(/(<([^>]+)>)/gi, "");
        if ($.trim(comment).length > 0) {
            return comment;
        }
        return "";
    },

    formSubmit: function(event) {
        $('#submit').prop('disabled', true);

        var self = this;

        var inBounds = home_handler.checkInBounds(mapData.drawnItemsLayer.getLayers()[0], mapData.geoJSON.cityBounds.getLayers()[0]);
        if (inBounds == false){
            home_handler.onOutOfBounds();
        }
        else if (inBounds == true){
            home_handler.onInBounds();
        }

        var underLimit = self.wordCount($('textarea[name=comment]').val()) <= self.properties.wordLimit;

        if (inBounds && underLimit){

            var fd = new FormData();  
            var photo =  $('input[name=photo]').prop('files')[0];

            var layer = mapData.drawnItemsLayer.getLayers()[0];
            var shape = layer.toGeoJSON();

            if (photo){
                fd.append( 'file',  photo );
            };


            var formData = {
                'name': self.formatText($('input[name=name]').val()) || 'Anonymous',
                'comment': self.formatText($('textarea[name=comment]').val()),
                'category' : $("select[name=category]").val(),
                created: 'date',
                type: shape.geometry.type,
                geometry: JSON.stringify(shape.geometry.coordinates)
            };

            $.each(formData, function(key, value)
            {
                fd.append(key, value);
            });

            $.ajax({
                type: "POST",
                url: mapData.featuresURL,
                processData: false,
                contentType: false,
                crossDomain: false,
                data: fd,
                success: function(json) {
                    $('#submit').prop('disabled', false);
                    if (json.error) {
                        if (json.error.code == 'imageFail'){
                            alert('Photo must be under 5 MB and be a gif, jpg, or png.')
                        }
                        else {
                            alert('Unable to complete your request at this time.');
                        }

                    } else {
                        mapData.drawnItemsLayer.clearLayers();
                        window.location.href = "#/step-three/";
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

        $("#suggestion-submit").submit(function(event) {
            self.formSubmit(event);
        });


        $('.content-error').click(function(event) {
            $(this).removeClass('animated bounceIn shake').addClass('hidden');
        });

        //On File Upload Set
        $('input[name=photo]').change(function(e){
            $in=$(this);

            if ($in.prop('files').length > 0){
                $in.next().html($in.prop('files')[0].name);
            }
            else {
                $in.next().html('Choose File...');
            }
        });

        $('textarea[name=comment]').on('input click', function() {
            var wordCount = self.wordCount($(this).val());
            if (wordCount > self.properties.wordLimit){
                $('.story-word').text(self.properties.wordLimit);
                $(this).addClass('required');
                $('.story-min').addClass('required');
            }
            else {
                $(this).removeClass('required');
                $('.story-min').removeClass('required');
                $('.story-word').text(wordCount);
            }
        });
    }
}