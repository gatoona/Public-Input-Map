$body = $("body");

var table;

$(document).on({
    ajaxStart: function() {
        $body.addClass("loading");
    },
    ajaxStop: function() {
        $body.removeClass("loading");
    },
    ajaxError: function() {
        $body.removeClass('loading');
    }
});

//Load
$(function() {
    $.ajaxSetup({
        // Disable caching of AJAX responses */
        cache: false
    });

    function hashGrab() {
        var hash = window.location.hash.substring(1).split('/')[1];
        loadPage(hash);
    }

    // Bind an event to window.onhashchange that, when the hash changes, gets the
    // hash and adds the class "selected" to any matching nav link.
    $(window).on('hashchange', function() {
        hashGrab();
    })

    //initial Load
    $(window).load(function() {
        hashGrab();
    });

});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1].replace('/', '');
        }
    }
};

function loadPage(hash) {

    $("#content-root").hide();

    if (hash == '' || hash == undefined) {
        $("#content-root").load("templates/home.html", function() {
        });
    }
    else {
        $("#content-root").load("templates/" + hash + ".html", function(responseText, textStatus, req) {
            if (textStatus == "error") {
                $("#content-root").load("templates/404.html", function() {});
            } else {
                var handler = hash.replace(/-/, '_') + '_handler';
                if (window[handler]){
                    var handler = window[handler];
                    
                    //Change Page Title
                    document.title = handler.properties.title;

                    //Start Table population
                    table = $('#datatable').DataTable({
                        ajax: handler.properties.ajaxURL,
                        colReorder: true,
                        lengthMenu: [
                            [10, 25, 50, -1],
                            [10, 25, 50, "All"]
                        ],
                        order: [],
                        scrollX: true,
                        autoFill: false,
                        select: {
                            style: 'selected',
                            items: 'row',
                            blurable: true
                        },
                        fixedHeader: true,
                        columns: handler.columns,
                        columnDefs: [
                            // {
                            //     targets: [ 2 ],
                            //     visible: false,
                            //     searchable: false
                            // },
                            // {
                            //     targets: [ 3 ],
                            //     visible: false
                            // },
                            {
                                targets: 'no-sort',
                                orderable: false,
                            }
                        ],
                        // Sets Row ID
                        rowId: 'id',

                        // createdRow: function( row, data, dataIndex ) {
                        //         $( row ).find('td:eq(1)').attr('class', 'name');
                        //     },


                        initComplete: function() {

                            // Apply the search
                            table.columns('.search').every(function() {
                                var that = this;

                                var search = $('<input type="text" placeholder="Search...">')
                                    .appendTo( $(that.footer()).empty() )
                                    .on('keyup change', function() {
                                    if (that.search() !== this.value) {
                                        that
                                            .search(this.value)
                                            .draw();
                                    }

                                    } );

                            });

                            // Apply the select
                            table.columns('.select').every(function() {
                                var that = this;

                                var select = $('<select><option value=""></option></select>')
                                    .appendTo( $(that.footer()).empty() )
                                    .on( 'change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );
                                
                                        that
                                            .search( val ? '^'+val+'$' : '', true, false )
                                            .draw();
                                    } );
                                
                                that.data().unique().sort().each( function ( d, j ) {
                                    select.append( '<option value="'+d+'">'+d+'</option>' )
                                });

                            });

                            table.columns.adjust().draw();


                        }

                    });

                    //Grab events
                    handler.events();
                }
            }
        });
    }

    $("#content-root").fadeIn('slow');

}