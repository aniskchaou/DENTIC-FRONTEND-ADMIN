$(function () {
    const choices = new Choices("select", {
        removeItems: true,
        removeItemButton: true
    });

    /*
        var table = $('table').DataTable({
               orderCellsTop: true,
               dom: 'Bfrtip',
               select: true,
               paging: true,
               autoFill: true,
               pageLength: 7,
               select: {
                   style: 'os',
                   selector: 'td:first-child'
               },
               buttons: [
                   'pdf', 'csvHtml5', 'excel', 'print'
               ],
               initComplete: function () {
                   this.api().columns([0, 4, 5]).every(function () {
                       var column = this;
                       var select = $('<select style="width:60px" ><option value=""></option></select>')
                           .appendTo($(column.footer()).empty())
                           .on('change', function () {
                               var val = $.fn.dataTable.util.escapeRegex(
                                   $(this).val()
                               );
       
                               column
                                   .search(val ? '^' + val + '$' : '', true, false)
                                   .draw();
                           });
       
                       column.data().unique().sort().each(function (d, j) {
                           select.append('<option value="' + d + '">' + d + '</option>')
                       });
                   });
               }
       
       
       
           });
           //$.fn.DataTable.ext.pager.numbers_length = 2;
           $('a.toggle-vis').on('click', function (e) {
               e.preventDefault();
       
               // Get the column API object
               var column = table.column($(this).attr('data-column'));
       
               // Toggle the visibility
               column.visible(!column.visible());
           });
       
       
           $('.dataTables_paginate').addClass("btn-group datatable-pagination");
           $('.dataTables_paginate > a').wrapInner('<span />');
           $('.dataTables_paginate > a:first-child').append('<i class="icon-chevron-left shaded"></i>');
           $('.dataTables_paginate > a:last-child').append('<i class="icon-chevron-right shaded"></i>');
       
       
           $('.tooltips').append("<span></span>");
           $('.tooltips:not([tooltip-position])').attr('tooltip-position', 'bottom');
       
       
           $(".tooltips").mouseenter(function () {
               $(this).find('span').empty().append($(this).attr('tooltip'));
           }); 
  */
});