comments_handler = {

    properties: {
        title: 'Comments',
        singular: 'comment',
        ajaxURL: '../admin/config/data.php/comments/'
    },

    columns: [
    {
        "data": null,
        "defaultContent": "<button class='btn btn-xs'>EDIT</button>"
    },
    {
        "data": "sid",
        "render": function(data, type, full, meta) {
            if (data) {
                var view = '<a target="_blank" href="../#/view/' + data + '">' + data + '</a>';
                return view;
            } else {
                return '';
            }
        }
    },
    {"data": "name"},
    {"data": "comment"},
    {
        "data": "created",
        "render": function(data, type, full, meta) {
            if (data) {
                return moment.unix(data).format('MM-DD-YYYY');
            } else {
                return '';
            }
        }
    },
    {"data": "uip"},
    {"data": "uipp"}
    ],

    onLoad: function() {
        var self = this;
        var dataSet = [];


        /*Buttons*/

        new $.fn.dataTable.Buttons(table, {
            buttons: [{
                    text: 'Delete',
                    className: 'btn-danger',
                    action: function() {
                        self.deleteEntry();
                    }
                }, {
                    extend: 'collection',
                    text: 'Export',
                    buttons: ['copy', 'excel', 'pdf']
                },
                'selectNone'
            ]
        });

        table.buttons().container()
            .appendTo($('.col-sm-6:eq(0)', table.table().container()));
    },

    getSelected: function() {

        var ids = table.rows({
            selected: true
        }).ids().toArray();
        return ids.join(',');

        // table.rows({ selected: true }).every( function () {
        //     table.cell(this, 1).data('as').invalidate().draw();
        // });
    },

    deleteEntry: function() {
        var self = this;

        $('.modal-body').empty();
        $('.modal-submit').off('click');
        $('.modal-title').text('Are you sure you want to delete?');
        $('.modal-submit').text('Delete');
        $('#myModal').modal();


        $('.modal-submit').click(function(event) {
            $.ajax({
                type: "DELETE",
                url: self.properties.ajaxURL + self.getSelected(),
                crossDomain: false,
                success: function(json) {
                    if (json.error) {
                        alert("There was an error.");
                    } else {
                        table.ajax.reload(null, false);
                        $('#myModal').modal('hide');
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    alert("There was an error.");
                }
            });
        });


    },

    editEntry: function(data) {

        var self = this;

        $('.modal-body').empty();
        $('.modal-submit').off('click');
        $('.modal-title').text('Edit ' + self.properties.singular);

        $(".form").clone().removeClass("hidden").appendTo(".modal-body");
        //Set Data

        $('.modal-body input[name=name]').val(data.name);
        $('.modal-body textarea[name=comment]').val(data.comment);


        $('#myModal').modal();

        $('.modal-submit').click(function(event) {
            $('.modal-submit').prop('disabled', true);
            var formData = {
                'name': $('input[name=name]').val(),
                'comment': $('.modal-body textarea[name=comment]').val()

            };

            $.ajax({
                type: "PUT",
                url: self.properties.ajaxURL + data.id,
                crossDomain: false,
                data: formData,
                success: function(json) {
                    if (json.error) {
                        alert("There was an error.");
                    } else {
                        $('#myModal').modal('hide');
                        table.ajax.reload(null, false);
                    }
                    $('.modal-submit').prop('disabled', false);
                },
                error: function(xhr, textStatus, errorThrown) {
                    alert("There was an error.");
                    $('.modal-submit').prop('disabled', false);
                }
            });
        });

    },

    events: function() {

        var self = this;
        self.onLoad();

        /*On Button Click*/

        $('#datatable tbody').on('click', 'button', function() {
            var data = table.row($(this).parents('tr')).data();
            self.editEntry(data);

        });

    }
}