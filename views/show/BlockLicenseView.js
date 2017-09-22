Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockLicenseView = Backbone.View.extend({

    template: _.template($('#licencia-tmpl').html()),

    events: {
        'click #addLicense':    'renderAddLicenseModal',
        'click #editLicense':   'renderEditLicenseModal',
        'click #addFonte':      'renderAddFonteModal',
        'click #removeLicense': 'removeLicense',
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
        event.preventDefault();

        // override default action for okButtonClicked
        var self = this;
        var AddFonteModalView = Backbone.UILib.ModalView.extend({
            okButtonClicked: function () {
                // in this context, this is the backbone modalView
                if(this.isSomeWidgetInvalid()) return;
                var atts = this.draftModel.pick(this.getAttsChanged());
                this.model.set(atts);
                self.model.get('fontes').add(this.model);
                this.$('.modal').modal('hide');
            }
        });

        var fonte = new Backbone.SIXHIARA.Fonte({tipo_agua: this.options.lic_tipo})
        var modalView = new AddFonteModalView({
            model: fonte,
            selectorTmpl: '#block-fonte-modal-tmpl'
        });
        modalView.$('#tipo_agua').prop('disabled', true)
        modalView.$('#okButton').text('Adicionar');

        // connect auxiliary views
        var fonteTipoView = new Backbone.UILib.SelectView({
            el: modalView.$('#tipo_fonte'),
            collection: this.options.domains.byCategory('fonte_tipo').byParent(fonte.get('tipo_agua'))
        }).render();
        modalView.addAuxView(fonteTipoView);

        var sistMedView = new Backbone.UILib.SelectView({
            el: modalView.$('#sist_med'),
            collection: this.options.domains.byCategory('sistema_medicao')
        }).render();
        modalView.addAuxView(sistMedView);

        modalView.render();

    },

    renderEditLicenseModal: function (event) {
        event.preventDefault();

        var modalView = new Backbone.SIXHIARA.LicenseModalView({
            modalSelectorTpl: '#block-license-modal-tmpl',
            collection: this.model.get('licencias'),
            collectionModel: Backbone.SIXHIARA.Licencia,
            model: this.license,
            domains: this.options.domains,
            editing: true,
        });

        modalView.show();
    },

    renderAddLicenseModal: function (event) {
        event.preventDefault();
        var self = this;
        var AddLicenseModalView = Backbone.SIXHIARA.LicenseModalView.extend({
            okButtonClicked: function () {
                // in this context, this is the backbone modalView
                if(this.isSomeWidgetInvalid()) return;
                this.collection.add(this.model);
                self.license = self.model.get('licencias').where({'lic_tipo': self.options.lic_tipo})[0];
                self.listenTo(self.license, 'change', self.render);
                self.render();
                this.$('.modal').modal('hide');
            }
        });

        var modalView = new AddLicenseModalView({
            modalSelectorTpl: '#block-license-modal-tmpl',
            collection: this.model.get('licencias'),
            collectionModel: Backbone.SIXHIARA.Licencia,
            model: new Backbone.SIXHIARA.Licencia({
                'lic_tipo': this.options.lic_tipo,
            }),
            domains: this.options.domains,
            editing: false,
        });

        modalView.show();
    },

    showModalEstadoLicencia: function(){
        new Backbone.SIXHIARA.ModalTooltipEstadoLicenciaView({
            collection: this.options.domains.byCategory('licencia_estado'),
            actual_state: this.license && this.license.get('estado') || null,
        }).show();
    },

});
