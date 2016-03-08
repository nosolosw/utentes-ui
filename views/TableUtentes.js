Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TableUtentes = Backbone.View.extend({


  template: '<table class="table table-hover table-bordered table-condensed"> <thead style="display: table-header-group;">  <tr id="header"> </tr> </thead> <tfoot style="display: table-header-group;"> <tr id="column-filter"> </tr> </tfoot> <tbody> </tbody> </table>',

  initialize: function(options){
    this.options = options || {};
    this.collection.on('reset', this.reset, this);
    this.columnNames = this.options.columnNames;
    this.columnTitles = this.options.columnTitles;
    this.formatValue = this.options.formatValue;
    this.customFiltering = this.options.customFiltering || [];
    this.colReorderOptions = this.options.colReorderOptions || false;
    this.columnsWithOutTitle = this.options.columnsWithOutTitle || [];
  },

  reset: function() {
    this.unrender();
    this.render();
  },

  unrender: function() {
    if (this.table) {
	     this.table.destroy('true')
	  }
	  this.$el.empty();
  },

  render: function() {
    this.createHtmlTable();
    this.createDataTable();
    this.custom();
  },

  createHtmlTable: function() {
    this.$el.append($(this.template));
    var trHeader = this.$el.find('table > thead #header');
    var trFilter = this.$el.find('table > tfoot #column-filter');
    var self = this;

    _.each(this.columnNames, function(v) {
      if (self.columnsWithOutTitle.indexOf(v) !== -1) {
        trHeader.append($('<th> </th>'));
        trFilter.append($('<th> </th>'));
      } else {
        var columnTitle = self.columnTitles[v];
        var s = '<th>' + columnTitle + '</th>';
        trHeader.append($(s));
        trFilter.append($('<th><input type="text" placeholder="'+ columnTitle +'" /></th>'));
      }

    });

    this.collection.forEach(this.appendRow, this);
  },

  appendRow: function(rowData){
    // FIXME. http://datatables.net/reference/option/rowId
    var s = '<tr id="gid-' + rowData.id + '">';
    var self = this;
    _.each(this.columnNames, function(field) {
      var v = rowData.get(field);
      v = self.formatValue(field, v, rowData);
      if (v !== null) {
        s += '<td>' + v + '</td>'
      }

    });

    s += '</tr>'
    $('tbody', this.el).append($(s));
  },

  createDataTable: function() {
    var self = this;
    var dataTableOptions = {
      dom: 'R<"#table-toolbar"l<"pull-right"i>>rtp',
      language: self.language,
    };

    var columnDefs = [];
    this.columnsWithOutTitle.forEach(function(column) {
      var idx = self.columnNames.indexOf(column)
      columnDefs.push({ "orderable": false, "targets": idx });
    });
    if (! _.isEmpty(columnDefs)) {
      dataTableOptions['columnDefs'] = columnDefs;
    }

    this.table = this.$('table').DataTable(dataTableOptions);

    /*
    If colReorder is set when a column is moved the search function must be
    reinitilized
    */
    if (this.colReorderOptions) {
      new $.fn.dataTable.ColReorder( this.table, {
        'reorderCallback': function () {
          self.table.columns({order:'applied'}).eq(0).each(function(colIdx) {
            self.table.column(colIdx).search('');
            $('input', self.table.column(colIdx).footer()).unbind().val('').on('keyup change',function(){
              self.table.column(colIdx).search(this.value).draw();
            });
          });
          // self.table.search('');
          self.table.draw();
        }
      });
    }

    this.table.columns().eq(0).each(function(colIdx) {
      $('input', self.table.column(colIdx).footer()).on('keyup change',function(){
        self.table.column(colIdx).search(this.value).draw();
      });
    });

    // http://datatables.net/examples/plug-ins/range_filtering.html
    // Allows combine DataTable filters with external filters
    this.customFiltering.forEach(function(customFilter){
      $.fn.dataTable.ext.search.push(customFilter);
    });
  },

  custom: function() {
    var self = this;
    $('#DataTables_Table_0_length').append($('<button id="create-button" type="button" class="btn btn-primary col-xs-1 pull-right">Criar</button>'));
    $('#create-button').on('click', function(){
      alert('Crear nueva utente');
    });

    $('#the_utentes_table table').on('click', 'button.delete', function() {
      // table.row ( rowSelector ) http://datatables.net/reference/type/row-selector
      var id = self.table.row(this.parentElement).id().split('-')[1];
      var u = self.collection.filter({id:parseInt(id)})[0];

      // FIXME. Don't reload page
      if (confirm('Tem certeza de que deseja excluir: ' + u.get('nome'))) {
        u.destroy({
          wait: true,
          success: function(model, resp, options) {
            window.location = Backbone.SIXHIARA.Config.utentesUrl;
          },
          error: function(xhr, textStatus, errorThrown) {
            alert(textStatus.statusText);
          }
        });
      }

    });

    $('#the_utentes_table table').on('click', 'button.edit', function() {
      // table.row ( rowSelector ) http://datatables.net/reference/type/row-selector
      var id = self.table.row(this.parentElement).id().split('-')[1];
      var u = self.collection.filter({id:parseInt(id)})[0];
      alert('Editando: ' + u.get('nome'));
    });

  },

  language: {
    "sProcessing":     "Procesando...",
    "sLengthMenu":     "Mostrar _MENU_ registros",
    "sZeroRecords":    "No se encontraron resultados",
    "sEmptyTable":     "Ningún dato disponible en esta tabla",
    // "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfo":           "_START_/_END_ de _TOTAL_",
    "sInfoEmpty":      "0/0 de 0",
    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix":    "",
    "sSearch":         "Buscar:",
    "sUrl":            "",
    "sInfoThousands":  ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
      "sFirst":    "Primero",
      "sLast":     "Último",
      "sNext":     "Siguiente",
      "sPrevious": "Anterior"
    },
    "oAria": {
      "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
      "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    },
  },


});
