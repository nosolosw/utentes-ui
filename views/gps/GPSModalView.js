Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.GPSModalView = Backbone.UILib.ModalView.extend({

  render: function() {

    // connect auxiliary views
    var tiposEntidade = new Backbone.UILib.DomainCollection();
    tiposEntidade.add([
      new Backbone.UILib.Domain({'alias':null, 'text':null, order: 0}),
      new Backbone.UILib.Domain({'alias':'Exploracao', 'text':'Exploracao', order: 1}),
      new Backbone.UILib.Domain({'alias':'Cultivo', 'text':'Cultivo', order: 2}),
      new Backbone.UILib.Domain({'alias':'Tanque Piscícola', 'text':'Tanque Piscícola', order: 3}),
    ]);

    var widgetsView = new Backbone.UILib.WidgetsView({
      el: $('#gpsModalView'),
      model: this.model
    }).render()
    this.addAuxView(widgetsView);

    var selectEntidade = new Backbone.UILib.SelectView({
      el: $('#entidade'),
      collection: tiposEntidade
    }).render();
    this.addAuxView(selectEntidade);

    var selectIdentificador = new Backbone.UILib.SelectView({
      el: this.$('#identificador'),
      collection: [],
    });
    this.addAuxView(selectIdentificador);

    var entidades = new Backbone.Collection();
    entidades.add(exploracaos.slice(0, exploracaos.length));
    entidades.add(cultivos.slice(0, cultivos.length));
    entidades.add(tanques.slice(0, tanques.length));
    entidades.forEach(function(v){
      if (v.has('exp_id')) {
        v.set('parent', 'Exploracao');
        v.set('alias',  v.get('exp_id'));
        v.set('text',   v.get('exp_id'));
      } else if (v.has('cult_id')) {
        v.set('parent', 'Cultivo');
        v.set('alias',  v.get('cult_id'));
        v.set('text',   v.get('cult_id'));
      } else {
        v.set('parent', 'Tanque Piscícola');
        v.set('alias',  v.get('tanque_id'));
        v.set('text',   v.get('tanque_id'));
      }
    });

    var self = this;
    selectIdentificador.listenTo(this.model, 'change:entidade', function(model, value, options){
      this.update(entidades.where({'parent': self.model.get('entidade')}));
    });

    this.$('.modal').modal('show');
  },

  okButtonClicked: function() {
    var entidade = this.model.get('entidade');
    var identificador = this.model.get('identificador');

    if (entidade === 'Exploracao') {
        e = exploracaos.filter({'exp_id': identificador});
    } else if (entidade === 'Cultivo') {
      e = cultivos.filter({'cult_id': identificador});
    } else {
      e = tanques.filter({'tanque_id': identificador});
    }
    if (e.length != 1) {
      alert('O arquivo de código não existe');
      return;
    }

    this.saveModelToAPI(e[0], feat.geometry)

    this.$('.modal').modal('hide');
  },

  saveModelToAPI: function(model, geometry) {
    model.get('geometry').set('type', geometry.type);
    model.get('geometry').set('coordinates', geometry.coordinates);
    model.set('geometry_edited', true);
    if(! model.isValid()) {
      alert(model.validationError);
      return;
    }

    model.save(null, {
      wait: true,
      success: function(model, resp, options) {
        table.deleteSelected();
        table.clear();
      },
      error: function(xhr, textStatus, errorThrown) {
        alert(textStatus.statusText + ' ' + textStatus.responseText);
      }
    });
  },
});
