Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockActivityView = Backbone.View.extend({

  initialize: function (options) {
    this.options = options || {};
    this.subViews = [];

    this.actividadeView = new Backbone.SIXHIARA.ActividadeView({
      el: this.el,
      model: this.model,
      template: _.template($("[id='" + this.model.get('actividade').get('tipo') + "']").html())
    });

    this.subViews.push(this.actividadeView);

    options.domains.on('sync', this.renderModal, this);

  },

  render: function () {
    _.invoke(this.subViews, 'render');
    var tipo = this.model.get('actividade').get('tipo');
    if (tipo === 'Pecuária') {
      this.editableTableView = new Backbone.SIXHIARA.EditableTableView({
        el: $('Pecuária'),
        newRowBtSelector: '#newRow',
        modalSelector: '#resModal',
        tableSelector: 'table#reses',
        collection: this.model.get('actividade').get('reses'),
        rowTemplate: '<td><%- c_estimado %></td><td><%- reses_tipo %></td><td><%- reses_nro %></td><td><%- c_res %></td><td><%- observacio %></td><td class="glyphicon glyphicon-edit edit"></td><td class="glyphicon glyphicon-trash close"></td>',
      })
      this.subViews.push(this.editableTableView);
    } else if (tipo === 'Agricultura-Regadia') {
      this.editableTableView = new Backbone.SIXHIARA.EditableTableView({
        el: $('Agricultura-Regadia'),
        newRowBtSelector: '#newRow',
        modalSelector: '#cultivoModal',
        tableSelector: 'table#cultivos',
        collection: this.model.get('actividade').get('cultivos'),
        rowTemplate: '<td><%- c_estimado %></td><td><%- cultivo %> / <%- rega %> </td><td><%- eficiencia %></td><td><%- area %></td><td><%- observacio %></td><td class="glyphicon glyphicon-edit edit"></td><td class="glyphicon glyphicon-trash close"></td>',
      })
      this.subViews.push(this.editableTableView);
    }

    return this;
  },

  renderModal: function (collection, response, options) {




        new Backbone.UILib.SelectView({
          el: $('#resModal #reses_tipo'),
          collection: this.options.domains.byCategory('animal_tipo'),
        }).render();
        new Backbone.UILib.SelectView({
          el: $('#cultivoModal #cultivo'),
          collection: this.options.domains.byCategory('cultivo_tipo'),
        }).render();
        new Backbone.UILib.SelectView({
          el: $('#cultivoModal #rega'),
          collection: this.options.domains.byCategory('rega_tipo'),
        }).render();


    var self = this;
    $('#editActividade').on('click', function(e){
      e.preventDefault();
      $('#editActividadeModal').modal('toggle');
    });

    $('#editActividadeModal').on('show.bs.modal', function(e){
      var tipoAct = self.model.get('actividade').get('tipo')
      if ((tipoAct === 'Agricultura-Regadia') || (tipoAct === 'Pecuária')) {
        $('#editActividadeModal #info-actividade').hide();
      } else {
        $('#editActividadeModal #info-actividade').show();
      }
    });

    $('#editActividadeModal').on('shown.bs.modal', function(e){
      $('#editActividadeModal #info-actividade').append($('<div class="actividade-render">'));
      var template = _.template($("[id='" + self.model.get('actividade').get('tipo') + "_edit']").html())
      $('#editActividadeModal .actividade-render').html('');
      $('#editActividadeModal .actividade-render').append(template(self.model.get('actividade').toJSON()));
      new Backbone.UILib.SelectView({
        el: $('#editActividadeModal #tipo_indus'),
        collection: self.options.domains.byCategory('industria_tipo')
      }).render();
      new Backbone.UILib.SelectView({
        el: $('#editActividadeModal #energia_tipo'),
        collection: self.options.domains.byCategory('energia_tipo')
      }).render();

      var actv = self.model.get('actividade');
      actv.keys().forEach(function(k){
        if (k === 'tipo') {
          $('#editActividadeModal #actividade').val(actv.get(k));
        } else {
          $('#editActividadeModal #' + k).val(actv.get(k));
        }
      });

      self.listenToOnce(self.model, 'change:actividade', function(model, value, options){
        self.doToggle = true;
        $('#editActividadeModal').modal('hide');
      });
    });

    $('#editActividadeModal').on('hidden.bs.modal', function(){
        $(this).find('input, textarea, select').val('');
        $('#editActividadeModal .actividade-render').remove();
        if (self.doToggle) {
            self.doToggle = false;
            $('#editActividadeModal').modal('show');
        }
    });

    $('#editActividadeModal').on('hide.bs.modal', function(){
        if (self.doToggle) return;
        if (!self.model.get('actividade')) return;
        $('#editActividadeModal .actividade-render').find('input, select, textarea').each(function(k, v){
          var $v = $(v);
          if ($v.hasClass('widget-number')) {
            self.model.get('actividade').set(v.id, formatter().unformatNumber($v.val()));
          } else {
            self.model.get('actividade').set(v.id, $v.val() || null);
          }
        });
        self.actividadeView.template = _.template($("[id='" + self.model.get('actividade').get('tipo') + "']").html());
        self.actividadeView.render();
    });

    var actividades = collection.byCategory('actividade');
    new Backbone.UILib.SelectView({
      el: $('#editActividadeModal #actividade'),
      collection: actividades
    }).render();

    // make the magic happen
    new Backbone.SIXHIARA.SelectActividadeView({
      el: $('#actividade-explotacion'),
      model: this.model
    });

  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subViews, 'remove');
  },

});
