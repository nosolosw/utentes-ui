Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockLicenseView = Backbone.View.extend({

  template: _.template($('#licencia-tmpl').html()),

  events: {
    'click #addLicense':    'renderAddLicenseModal',
    'click #removeLicense': 'removeLicense',
    'click #editLicense':   'renderEditLicenseModal',
    'click #addFonte':      'renderAddFonteModal',
    'click #info-estado-licencia': 'showModalEstadoLicencia',
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
    new Backbone.SIXHIARA.FonteShowModalView({
      textConfirmBt: 'Adicionar',
      domains: this.options.domains,
      editing: false,
      collection: this.model.get('fontes'),
      model: new Backbone.SIXHIARA.Fonte({tipo_agua: this.options.lic_tipo}),
    }).show();
  },

  renderEditLicenseModal: function (event) {
    event.preventDefault();
    var modalView = new Backbone.SIXHIARA.ModalView({
      modalSelectorTpl: '#block-license-modal-tmpl',
      model: this.license,
      domains: this.options.domains,
      editing: true,
    });
    modalView.customConfiguration = function() {
      new Backbone.UILib.SelectView({
        el: this.$('#estado'),
        collection: this.options.domains.byCategory('licencia_estado')
      }).render();
      var self = this;
      this.$('#info-estado-licencia').on('click', function() {
        new Backbone.SIXHIARA.ModalTooltipEstadoLicenciaView({
            collection: self.options.domains.byCategory('licencia_estado'),
            actual_state: self.model.get('estado'),
        }).show();
      });
    }
    modalView.show();
  },

  renderAddLicenseModal: function (event) {
    event.preventDefault();

    // FIXME Probably we should use the editing=false mode
    this.license = new Backbone.SIXHIARA.Licencia({
      'lic_tipo': this.options.lic_tipo,
    });

    this.model.get('licencias').add(this.license);
    this.listenTo(this.license, 'change', this.render);
    this.render();

    var modalView = new Backbone.SIXHIARA.ModalView({
      modalSelectorTpl: '#block-license-modal-tmpl',
      model: this.license,
      domains: this.options.domains,
      editing: true,
    });
    modalView.customConfiguration = function() {
      new Backbone.UILib.SelectView({
        el: this.$('#estado'),
        collection: this.options.domains.byCategory('licencia_estado')
      }).render();
      var self = this;
      this.$('#info-estado-licencia').on('click', function() {
        new Backbone.SIXHIARA.ModalTooltipEstadoLicenciaView({
            collection: self.options.domains.byCategory('licencia_estado'),
            actual_state: self.model.get('estado'),
        }).show();
      });
    }
    modalView.show();
  },

  showModalEstadoLicencia: function(){
    new Backbone.SIXHIARA.ModalTooltipEstadoLicenciaView({
      collection: this.options.domains.byCategory('licencia_estado'),
      actual_state: this.license && this.license.get('estado') || null,
    }).show();
  },

});
