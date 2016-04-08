Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockLicenseView = Backbone.View.extend({

  template: _.template($('#licencia-tmpl').html()),

  events: {
    'click #addLicense':    'renderAddLicenseModal',
    'click #removeLicense': 'removeLicense',
    'click #editLicense':   'renderEditLicenseModal',
    'click #addFonte':      'renderAddFonteModal'
  },

  initialize: function(options){
    this.options = options;

    this.license = this.model.get('licencias').where({'lic_tipo': options.lic_tipo})[0];
    if(this.license) this.listenTo(this.license, 'change', this.render);

  },

  render: function(){
    this.$el.html('');
    if(this.license){
      this.$el.append(this.template(this.license.toJSON()));
      this.$('#addLicense').addClass('hidden');
      this.$('#editLicense').removeClass('hidden');
      this.$('#addFonte').removeClass('hidden');
      this.$('#removeLicense').removeClass('hidden');
    } else {
      var lic = new Backbone.SIXHIARA.Licencia({
        'lic_tipo': this.options.lic_tipo,
        'lic_nro': 'Não existe',
      });
      this.$el.append(this.template(lic.toJSON()));
      this.$('#addLicense').removeClass('hidden');
      this.$('#editLicense').addClass('hidden');
      this.$('#addFonte').addClass('hidden');
      this.$('#removeLicense').addClass('hidden');
    }

    return this;
  },

  removeLicense: function (e) {
    var confirmation = confirm('Se você aceitar a licença e as fontes associadas serán borradas');
    if (!confirmation) return;
    this.model.get('licencias').remove(this.license);
    var fontes = this.model.get('fontes').where({'tipo_agua': this.options.lic_tipo});
    this.model.get('fontes').remove(fontes);
    this.stopListening(this.license, 'change');
    this.license = null;
    this.render();
  },

  renderAddFonteModal: function (event) {

    // append modal to DOM
    var node = $(document.body).append($('#edit-fonte-modal-tmpl').html());
    var subViewsModal = [];

    // take it from DOM and connect events, fill components, etc
    var modalEl = $('#editFonteModal');
    // update name of action
    var modalAddEl = $('#editFonteModal #updateFonte');
    modalAddEl.text('Adicionar');
    var view = this;
    var tipoAgua = view.options.lic_tipo;
    modalAddEl.on('click', function () {
      view.model.get('fontes').add(new Backbone.SIXHIARA.Fonte({
        'tipo_agua':  tipoAgua,
        'tipo_fonte': $('#editFonteModal #fonte_tipo').val(),
        'c_soli':     formatter().unformatNumber($('#editFonteModal #c_soli').val()),
        'observacio': $('#editFonteModal #observacio').val(),
      }));
    });

    var tiposView = new Backbone.UILib.SelectView({
      el: $('#editFonteModal #fonte_tipo'),
      collection: this.options.domains.byCategory('fonte_tipo').byParent(tipoAgua)
    }).render();
    subViewsModal.push(tiposView);

    // remove modal from DOM on hide
    modalEl.on('hidden.bs.modal', function () {
      // this is the modal itself
      // should we unbind the events too?
      $(this).remove();
      subViewsModal.forEach(function (view) {
        view.remove();
      })
    });

    modalEl.modal('show');

  },

  renderEditLicenseModal: function (event) {

    // add modal to DOM
    var node = $(document.body).append($('#block-license-modal-tmpl').html());
    var subViewsModal = [];

    // take it from DOM and connect events, fill components, etc
    var modalEl = $('#licenciaModal');
    var estadoView = new Backbone.UILib.SelectView({
      el: $('#licenciaModal #estado'),
      collection: this.options.domains.byCategory('licencia_estado')
    }).render();
    subViewsModal.push(estadoView);

    var modelView = new Backbone.UILib.WidgetsView({
      el: modalEl,
      model: this.license,
    }).render();
    subViewsModal.push(modelView);

    // remove modal from DOM on hide
    modalEl.on('hidden.bs.modal', function () {
      // this is the modal itself
      // should we unbind the events too?
      $(this).remove();
      subViewsModal.forEach(function (view) {
        view.remove();
      });

    });

    // do open modal
    modalEl.modal('show');

  },

  renderAddLicenseModal: function (event) {

    // add modal to DOM
    var node = $(document.body).append($('#block-license-modal-tmpl').html());
    var subViewsModal = [];
    this.license = new Backbone.SIXHIARA.Licencia({
      'lic_tipo': this.options.lic_tipo,
    });
    this.model.get('licencias').add(this.license);
    this.listenTo(this.license, 'change', this.render);
    this.render();

    // take it from DOM and connect events, fill components, etc
    var modalEl = $('#licenciaModal');
    var estadosView = new Backbone.UILib.SelectView({
      el: $('#licenciaModal #estado'),
      collection: this.options.domains.byCategory('licencia_estado')
    }).render();
    subViewsModal.push(estadosView);

    var modalView = new Backbone.UILib.WidgetsView({
      el: modalEl,
      model: this.license,
    }).render();
    subViewsModal.push(modalView);

    // remove modal from DOM on hide
    modalEl.on('hidden.bs.modal', function () {
      // this is the modal itself
      // should we unbind the events too?
      $(this).remove();
      subViewsModal.forEach(function (view) {
        view.remove();
      });
    });

    // do open modal
    modalEl.modal('show');

  },

});
