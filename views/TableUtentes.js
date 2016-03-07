Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TableUtentes = Backbone.View.extend({

  // how to instantiate this view
  //
  // var tableUtentes = new Backbone.SIXHIARA.TableUtentes({
  //   collection: collection,
  //   el: el
  // });

   template: '<table class="table table-hover table-bordered table-condensed"> <thead style="display: table-header-group;">  <tr id="header"> </tr> </thead> <tfoot style="display: table-header-group;"> <tr id="column-filter"> </tr> </tfoot> <tbody> </tbody> </table>',

  initialize: function(options){
    this.options = options || {};
    this.collection.on('reset', this.reset, this);
    this.columnNames = this.options.columnNames;
    this.columnTitles = this.options.columnTitles;
    this.formatValue = this.options.formatValue;
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
  },

  createHtmlTable: function() {
    this.$el.append($(this.template));
    var trHeader = this.$el.find('table > thead #header');
    var trFilter = this.$el.find('table > tfoot #column-filter');
    var self = this;

    _.each(this.columnNames, function(v) {
      var columnTitle = self.columnTitles[v];
      var s = '<th>' + columnTitle + '</th>';
      trHeader.append($(s));
      trFilter.append($('<th><input type="text" placeholder="'+ columnTitle +'" /></th>'));
    });

    this.collection.forEach(this.appendRow, this);
  },

  appendRow: function(rowData){
    var s = '<tr>';
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
    this.table = this.$('table').DataTable({
      dom: 'R<"#table-toolbar"l<"pull-right"i>>rtp',
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
        }
      },
      "colReorder": {
        "reorderCallback": function () {
          self.table.columns({order:'applied'}).eq(0).each(function(colIdx) {
            self.table.column(colIdx).search('');
            $('input', self.table.column(colIdx).footer()).unbind().val('').on('keyup change',function(){
              self.table.column(colIdx).search(this.value).draw();
            });
          });
          // self.table.search('');
          self.table.draw();
        }
      },
    });

    this.table.columns().eq(0).each(function(colIdx) {
      $('input', self.table.column(colIdx).footer()).on('keyup change',function(){
        self.table.column(colIdx).search(this.value).draw();
      });
    });
  }
  //
  // render: function(){
  //   this.$el.append(this.template(this.model.toJSON()));
  //
  //   return this;
  // },

});
