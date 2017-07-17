Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LicenseView = Backbone.UILib.BaseView.extend({

  events: {
    'click input:checkbox': 'clickActive',
    'click .help': 'showModalEstadoLicencia',
  },

  initialize: function (options) {
    Backbone.UILib.BaseView.prototype.initialize.call(this);
    this.options = options || {};
    this.lic_tipo = this.options.lic_tipo;

    this.license = new Backbone.SIXHIARA.Licencia({'lic_tipo': this.lic_tipo});
    this.updateModelView = new Backbone.UILib.WidgetsView({
      el: this.el,
      model: this.license
    });
    this.addView(this.updateModelView);

    var self = this;
    this.$(this.options.selectorButtonAddFonte).on('click', function (e) {
      self.renderModal(e);
    });

    this.isDisabled = true;
    var app = this;
    this.domainsFilled = false;
    this.options.domains.on('sync', function () {
      app.domainsFilled = true;
      app.estadosLicencia = app.options.domains.byCategory('licencia_estado');
      var estadosView = new Backbone.UILib.SelectView({
        el: app.$('#estado'),
        collection: app.estadosLicencia
      });
      app.addView(estadosView);
      app.render();
      estadosView.$el.prop('disabled', app.isDisabled);
    });
  },

  // render - Backbone.UILib.BaseView.prototype.render.call(this);

  // remove - Backbone.UILib.BaseView.prototype.remove.call(this);

  clickActive: function (e) {
    if(e.target.checked){
      this.license.changeEstadoOnCheck();
      this.model.get('licencias').add(this.license);
      this.enableWidgets();
    } else {
      this.model.get('licencias').remove(this.license);
      var fontes = this.model.get('fontes').where({'tipo_agua': this.lic_tipo});
      this.model.get('fontes').remove(fontes);

      this.license = new Backbone.SIXHIARA.Licencia({'lic_tipo': this.lic_tipo});
      this.updateModelView.model = this.license;
      this.updateModelView.render();
      
      this.disableWidgets();
    }
  },

  disableWidgets: function () {
    this.isDisabled = true;
    this.$('label.set-enability').addClass('text-muted');
    this.$('.widget').prop('disabled', this.isDisabled);
    this.$('.widget-number').prop('disabled', this.isDisabled);
    this.$('button').prop('disabled', this.isDisabled);
  },

  enableWidgets: function () {
    this.isDisabled = false;
    this.$('label.set-enability').removeClass('text-muted');
    this.$('.widget').prop('disabled', this.isDisabled);
    this.$('.widget-number').prop('disabled', this.isDisabled);
    this.$('button').prop('disabled', this.isDisabled);
  },

  showModalEstadoLicencia: function() {
    console.log('clicked');
    new Backbone.SIXHIARA.ModalTooltipEstadoLicenciaView({
      collection: this.estadosLicencia,
      actual_state: this.license.get('estado'),
    }).show();
  },

  renderModal: function (e) {

    if(!this.domainsFilled) return;

    e.preventDefault();

    // override default action for okButtonClicked
    var self = this;
    var AddFonteModal = Backbone.UILib.ModalView.extend({
      okButtonClicked: function () {
        if(this.isSomeWidgetInvalid()) return;
        self.model.get('fontes').add(this.draftModel);
        this.$('.modal').modal('hide');
      }
    });

    var modalView = new AddFonteModal({
      model: new Backbone.SIXHIARA.Fonte({
        'tipo_agua': this.lic_tipo
      }),
      selectorTmpl: this.options.selectorModalFonte
    });

    var fonteTipos = this.options.domains.byCategory('fonte_tipo');
    var tipoFontesView = new Backbone.UILib.SelectView({
      el: modalView.$('#tipo_fonte'),
      collection: fonteTipos.byParent(this.lic_tipo)
    }).render();
    modalView.addAuxView(tipoFontesView);

    modalView.render();
  },


});
