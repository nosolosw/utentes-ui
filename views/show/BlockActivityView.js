Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockActivityView = Backbone.View.extend({

  initialize: function (options) {
    this.options = options || {};
    this.subViews = [];
    var tipoAct = this.model.getActividadeTipo();
    if (tipoAct !== 'Actividade non declarada') {
      var template = _.template($("[id='" + this.model.get('actividade').get('tipo') + "']").html());
    } else {
      var template = null;
    }

    this.actividadeView = new Backbone.SIXHIARA.ActividadeView({
      el: this.el,
      model: this.model,
      domains: options.domains,
      template: template
    });

    this.subViews.push(this.actividadeView);

    options.domains.on('sync', this.renderModal, this);

  },

  render: function () {
    _.invoke(this.subViews, 'render');
    var tipo = this.model.get('actividade').get('tipo');
    if (this.editableTableView) this.editableTableView.off();
    if (tipo === 'Pecuária') {
      this.editableTableView = new Backbone.SIXHIARA.EditableTableView({
        el: $('Pecuária'),
        newRowBtSelector: '#newRow',
        modalSelectorTpl: '#resModalTpl',
        tableSelector: 'table#reses',
        collection: this.model.get('actividade').get('reses'),
        rowTemplate: '<td><% print(formatter().formatNumber(c_estimado)) %></td><td><%- reses_tipo %></td><td><% print(formatter().formatNumber(reses_nro)) %></td><td><%- observacio %></td><td class="glyphicon glyphicon-edit edit"></td><td class="glyphicon glyphicon-trash close"></td>',
        collectionModel: Backbone.SIXHIARA.ActividadeRes,
        domains: this.options.domains,
      })
      this.subViews.push(this.editableTableView);
    } else if (tipo === 'Agricultura-Regadia') {
      this.editableTableView = new Backbone.SIXHIARA.EditableTableView({
        el: $('Agricultura-Regadia'),
        newRowBtSelector: '#newRow',
        modalSelectorTpl: '#cultivoModalTpl',
        tableSelector: 'table#cultivos',
        collection: this.model.get('actividade').get('cultivos'),
        rowTemplate: '<td><%- cult_id %></td><td><% print(formatter().formatNumber(c_estimado)) %></td><td><%- cultivo %></td><td><%- rega %> </td><td><% print(formatter().formatNumber(area)) %></td><td><%- observacio %></td><td class="glyphicon glyphicon-edit edit"></td><td class="glyphicon glyphicon-trash close"></td>',
        collectionModel: Backbone.SIXHIARA.ActividadeCultivo,
        domains: this.options.domains,
      })
      this.subViews.push(this.editableTableView);
    }

    return this;
    },

  renderModal: function (collection, response, options) {

    var self = this;
    $('#editActividade').on('click', function(e){
      e.preventDefault();
      $('#editActividadeModal').modal('toggle');
    });

    $('#editActividadeModal').on('show.bs.modal', function(e){
      var tipoAct = self.model.getActividadeTipo();
      if ((tipoAct === 'Agricultura-Regadia') || (tipoAct === 'Pecuária') || (tipoAct === 'Actividade non declarada')) {
        $('#editActividadeModal #info-actividade').hide();
      } else {
        $('#editActividadeModal #info-actividade').show();
      }
    });

    $('#editActividadeModal').on('shown.bs.modal', function(e){
      $('#editActividadeModal #info-actividade').append($('<div class="actividade-render">'));
      $('#editActividadeModal .actividade-render').html('');
      if (self.model.getActividadeTipo() !== 'Actividade non declarada') {
        var template = _.template($("[id='" + self.model.get('actividade').get('tipo') + "_edit']").html());
        $('#editActividadeModal .actividade-render').append(template(self.model.get('actividade').toJSON()));
      }
      new Backbone.UILib.SelectView({
        el: $('#editActividadeModal #tipo_indus'),
        collection: self.options.domains.byCategory('industria_tipo')
      }).render();
      new Backbone.UILib.SelectView({
        el: $('#editActividadeModal #eval_impac'),
        collection: self.options.domains.byCategory('boolean'),
      }).render();
      new Backbone.UILib.SelectView({
        el: $('#editActividadeModal #energia_tipo'),
        collection: self.options.domains.byCategory('energia_tipo')
      }).render();
      new Backbone.SIXHIARA.CEstimadoComputedView({
        el: $('#c_estimado_computed'),
        model: self.model
      }).render();

      var actv = self.model.get('actividade');
      if (actv) {
        actv.keys().forEach(function(k){
          if (k === 'tipo') {
            $('#editActividadeModal #actividade').val(actv.get(k));
          } else {
            $('#editActividadeModal #' + k).val(actv.get(k));
          }
        });
      };

      self.listenToOnce(self.model, 'change:actividade', function(model, value, options){
        var tipoAct = self.model.getActividadeTipo();
        if ((tipoAct === 'Agricultura-Regadia') || (tipoAct === 'Pecuária') || tipoAct === 'Actividade non declarada') {
          self.doToggle = false;
        } else {
          self.doToggle = true;
        }
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
      var tipoAct = self.model.getActividadeTipo();
      if ((tipoAct !== 'Agricultura-Regadia') && (tipoAct !== 'Pecuária') && (tipoAct !== 'Actividade non declarada')) {
        $('#editActividadeModal .actividade-render').find('input, select, textarea').each(function(k, v){
          var $v = $(v);
          if ($v.hasClass('widget-number')) {
            self.model.get('actividade').set(v.id, formatter().unformatNumber($v.val()));
          } else if ($v.hasClass('widget-boolean')){
            var option = $v.find('option:selected').val();
            var value = null;
            if(option === 'true') value = true;
            if(option === 'false') value = false;
            self.model.get('actividade').set(v.id, value);
          } else {
            self.model.get('actividade').set(v.id, $v.val() || null);
          }
        });
      }
      if (tipoAct !== 'Actividade non declarada') {
        self.actividadeView.template = _.template($("[id='" + self.model.get('actividade').get('tipo') + "']").html());
      } else {
        self.actividadeView.template = null;
      }
      self.actividadeView.render();

      if (self.editableTableView) self.editableTableView.off();
      if (tipoAct === 'Pecuária') {
        self.editableTableView = new Backbone.SIXHIARA.EditableTableView({
          el: $('Pecuária'),
          newRowBtSelector: '#newRow',
          modalSelectorTpl: '#resModalTpl',
          tableSelector: 'table#reses',
          collection: self.model.get('actividade').get('reses'),
          rowTemplate: '<td><% print(formatter().formatNumber(c_estimado)) %></td><td><%- reses_tipo %></td><td><% print(formatter().formatNumber(reses_nro)) %></td><td><%- observacio %></td><td class="glyphicon glyphicon-edit edit"></td><td class="glyphicon glyphicon-trash close"></td>',
          collectionModel: Backbone.SIXHIARA.ActividadeRes,
          domains: self.options.domains,
        })
        self.subViews.push(self.editableTableView);
      } else if (tipoAct === 'Agricultura-Regadia') {
        self.editableTableView = new Backbone.SIXHIARA.EditableTableView({
          el: $('Agricultura-Regadia'),
          newRowBtSelector: '#newRow',
          modalSelectorTpl: '#cultivoModalTpl',
          tableSelector: 'table#cultivos',
          collection: self.model.get('actividade').get('cultivos'),
          rowTemplate: '<td><%- cult_id %></td><td><% print(formatter().formatNumber(c_estimado)) %></td><td><%- cultivo %></td><td><%- rega %></td><td><% print(formatter().formatNumber(area)) %></td><td><%- observacio %></td><td class="glyphicon glyphicon-edit edit"></td><td class="glyphicon glyphicon-trash close"></td>',
          collectionModel: Backbone.SIXHIARA.ActividadeCultivo,
          domains: self.options.domains,
        })
        self.subViews.push(self.editableTableView);
      }
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
