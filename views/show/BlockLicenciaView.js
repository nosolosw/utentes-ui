Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockLicenciaView = Backbone.View.extend({

  template: _.template($('#licencia-tmpl').html()),

  events: {
    'click #editLicense': 'renderEditLicenseModal',
    'click #addFonte': 'renderAddFonteModal'
  },

  initialize: function(options){
    this.options = options;
  },

  render: function(){
    if(!this.model) return;
    this.$el.html('');
    this.$el.append(this.template(this.model.toJSON()));

    return this;
  },

  renderAddFonteModal: function () {

    // append modal to DOM
    var node = $(document.body).append($('#edit-fonte-modal-tmpl').html());

    // take it from DOM and connect events, fill components, etc
    var modalEl = $('#editFonteModal');
    // update name of action
    var modalAddEl = $('#editFonteModal #updateFonte');
    modalAddEl.text('Adicionar');
    var view = this;
    modalAddEl.on('click', function () {
      view.options.fontes.add(new Backbone.SIXHIARA.Fonte({
        'tipo_agua':  view.model.get('lic_tipo'),
        'tipo_fonte': $('#editFonteModal #fonte_tipo').val(),
        'c_soli':     formatter().unformatNumber($('#editFonteModal #c_soli').val()),
        'observacio': $('#editFonteModal #observacio').val(),
      }));
    });

    var tipoAgua = this.model.get('lic_tipo');
    new Backbone.UILib.SelectView({
      el: $('#editFonteModal #fonte_tipo'),
      collection: this.options.domains.byCategory('fonte_tipo').byParent(tipoAgua)
    }).render();

    // remove modal from DOM on hide
    modalEl.on('hidden.bs.modal', function () {
      // this is the modal itself
      // should we unbind the events too?
      $(this).remove();
    });

    modalEl.modal('show');

  },

  renderEditLicenseModal: function (event) {

    // add modal to DOM
    var node = $(document.body).append($('#licencia-modal-tmpl').html());

    // take it from DOM and connect events, fill components, etc
    var modalEl = $('#licenciaModal');
    var estadoSelectEl = $('#licenciaModal #estado');

    // connect components and fill select after modal was added to DOM
    new Backbone.UILib.SelectView({
      el: estadoSelectEl,
      collection: this.options.domains.byCategory('licencia_estado')
    }).render();

    new Backbone.UILib.WidgetsView({
      el: modalEl,
      model: this.model,
    }).render();

    // remove modal from DOM on hide
    modalEl.on('hidden.bs.modal', function () {
      // this is the modal itself
      // should we unbind the events too?
      $(this).remove();
    });

    // do open modal
    modalEl.modal('show');

  },

});
