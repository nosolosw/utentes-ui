Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LicenseView = Backbone.UILib.BaseView.extend({

  events: {
    'click input:checkbox': 'clickActive',
  },

  initialize: function (options) {
    Backbone.UILib.BaseView.prototype.initialize.call(this);
    this.lic_tipo = options.lic_tipo;

    this.license = new Backbone.SIXHIARA.Licencia({'lic_tipo': this.lic_tipo});
    this.updateModelView = new Backbone.UILib.WidgetsView({
      el: this.el,
      model: this.license
    });
    this.addView(this.updateModelView);

    options.elModalFonteButton.on('click', function (e) {
      e.preventDefault();
      options.elModalFonte.modal('toggle');
    });
    var modalFonte = new Backbone.SIXHIARA.ModalFonteView({
      el: options.elModalFonte,
      collection: exploracao.get('fontes')
    });
    this.addView(modalFonte);

    this.isDisabled = true;
    var app = this;
    options.domains.on('sync', function () {
      var estadosLicencia = options.domains.byCategory('licencia_estado');
      var fonteTipos = options.domains.byCategory('fonte_tipo');

      var estadosView = new Backbone.UILib.SelectView({
        el: app.$('#estado'),
        collection: estadosLicencia
      });
      app.addView(estadosView);

      var tipoFontesView = new Backbone.UILib.SelectView({
        el: options.elModalFonteSelect,
        collection: fonteTipos.byParent(app.lic_tipo)
      });
      app.addView(tipoFontesView);

      app.render();

      estadosView.$el.prop('disabled', app.isDisabled);
    });
  },

  // render - Backbone.UILib.BaseView.prototype.render.call(this);

  // remove - Backbone.UILib.BaseView.prototype.remove.call(this);

  clickActive: function (e) {
    if(e.target.checked){
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

});
