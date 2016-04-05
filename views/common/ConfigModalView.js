Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ConfigModalView = Backbone.View.extend({


  html: `
  <div class="modal fade" id="configModalView" tabindex="-1" role="dialog" aria-labelledby="configModalViewLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Pechar"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="configModalViewLabel">Configuraçao</h4>
        </div>
        <div class="modal-body">
          <div class="row">
          <label class="col-xs-offset-1" for="docPath">Ruta aos documentos</label>
            <div class="input-group col-xs-offset-1 col-xs-10">
              <input type="text" class="form-control" id="docPath" aria-describedby="openFile" disabled>
              <span class="input-group-addon btn btn-default" id="openFile">...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,

  idModal: '#configModalView',

  events: {
    'click .close': 'close',
    'click #openFile': 'open',
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




    var self = this;
    $(this.idModal).on('hide.bs.modal', function(){
      self.s.save(null);
    });
    $(this.idModal).on('hidden.bs.modal', function(){
      self._close();
    });
    this.s = new Backbone.SIXHIARA.Setting();
    this.s.fetch({
      success: function() {
          self.setValue();
          $(self.idModal).modal('show');
      }
    });

  },

  close: function() {
    $(this.idModal).modal('hide');
  },

  _close: function() {
    $(this.idModal).unbind();
    $(this.idModal).remove();
    this.remove();
  },

  open:function() {
    var remote = nodeRequire('remote');

    var dialog = remote.require('dialog');
    var file = dialog.showOpenDialog({
      properties: [ 'openDirectory' ],
      defaultPath: this.s.get('docPath'),
    });

    if (file) {
      this.s.set('docPath', file[0]);
      this.setValue();
    }
  },

  setValue: function() {
    var docPath = this.s.get('docPath');
    $(this.idModal).find('#docPath').val(docPath);
  },

});
