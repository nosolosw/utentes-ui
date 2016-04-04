Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.GPSModalView = Backbone.View.extend({


  html: `
  <div class="modal fade" id="gpsModalView" tabindex="-1" role="dialog" aria-labelledby="editInfoModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Pechar"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="editInfoModalLabel">Selecione o item</h4>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="form-group col-xs-offset-1 col-xs-4">
              <label for="entidade">Entidade</label>
              <select class="form-control widget" id="entidade"></select>
            </div>
            <div class="form-group col-xs-offset-1 col-xs-4">
              <label for="identificador">Identificador</label>
              <select class="form-control widget" id="identificador"></select>
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary" id="save">Salvar</button>
        </div>
      </div>
    </div>
  </div>
  `,

  events: {
    'click .close': 'close',
    'click #save': 'saveGeom',
  },

  initialize: function() {
    // this.template = _.template($('#modal-template').html());
    this.template = _.template(this.html);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  show: function() {
    $(document.body).append(this.render().el);

    bl = new Backbone.UILib.Domain({'alias':null, 'text':null});
    exp = new Backbone.UILib.Domain({'alias':'Exploracao', 'text':'Exploracao'});
    cul = new Backbone.UILib.Domain({'alias':'Cultivo', 'text':'Cultivo'});
    col = new Backbone.Collection([bl, exp,cul]);

    new Backbone.UILib.WidgetsView({
      el: $('#gpsModalView'),
      model: this.model
    }).render()

    var selectEntidade = new Backbone.UILib.SelectView({
      el: $('#entidade'),
      collection: col
    }).render();

    var selectIdentificador = new Backbone.UILib.SelectView({
      el: this.$('#identificador'),
      collection: [],
    });

    var cul_y_exp = new Backbone.Collection();
    cul_y_exp.add(cultivos.slice(0, cultivos.length));
    cul_y_exp.add(exploracaos.slice(0, exploracaos.length));
    cul_y_exp.forEach(function(v){

      if (v.has('exp_id')) {
        v.set('parent', 'Exploracao');
        v.set('alias', v.get('exp_id'));
        v.set('text', v.get('exp_id'));
      } else {
        v.set('alias', v.get('cult_id'));
        v.set('text', v.get('cult_id'));
        v.set('parent', 'Cultivo');
      }
    });

    var self = this;
    selectIdentificador.listenTo(this.model, 'change:entidade', function(model, value, options){
      this.update(cul_y_exp.where({'parent': self.model.get('entidade')}));
    });

    $('#gpsModalView').on('hidden.bs.modal', function(){
      self._close();
    });
    $('#gpsModalView').modal('show');
  },

  close: function() {
    $('#gpsModalView').modal('hide');
  },

  _close: function() {
    $('#gpsModalView').unbind();
    $('#gpsModalView').remove();
    this.remove();
  },

  saveGeom: function() {
    var entidade = this.model.get('entidade');
    var identificador = this.model.get('identificador');

    if (entidade === 'Cultivo') {
      e = cultivos.filter({'cult_id': identificador});
    } else {
      e = exploracaos.filter({'exp_id':identificador});
    }
    if (e.length != 1) {
      alert('O arquivo de código não existe');
      return;
    }

    this.saveModelToAPI(e[0], feat.geometry)
    this.close();
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
