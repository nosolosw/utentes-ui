Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockInfoView = Backbone.View.extend({

    events: {
        'click #editBlockInfo': 'renderModal'
    },

    initialize: function (options) {
        this.subViews = [];
        this.options = options;

        var exploracao = this.model;
        var licSup = exploracao.get('licencias').where({'lic_tipo': 'Superficial'})[0];
        var licSub = exploracao.get('licencias').where({'lic_tipo': 'Subterrânea'})[0];

        // create subviews
        var infoView = new Backbone.UILib.WidgetsView({
            el: this.el,
            model: exploracao
        });
        this.subViews.push(infoView);

        var summaryLicenseView = new Backbone.SIXHIARA.SummaryLicenseView({
            el: $('#summary_licencia_msg'),
            model: exploracao
        });
        this.subViews.push(summaryLicenseView);

        var summaryConsumoView = new Backbone.SIXHIARA.SummaryConsumoView({
            el: $('#summary_consumo_msg'),
            model: exploracao
        });
        this.subViews.push(summaryConsumoView);

        var summaryPagosView = new Backbone.SIXHIARA.SummaryPagosView({
            el: $('#summary_pagos_msg'),
            model: exploracao
        });
        this.subViews.push(summaryPagosView);

        this.domainsFilled = false;
        options.domains.on('sync', this.setDomainsFilled, this);

        exploracao.on('change', this.render, this);

    },

    setDomainsFilled: function () {
        this.domainsFilled = true;
    },

    render: function () {
        _.invoke(this.subViews, 'render');

        return this;
    },

    renderModal: function (event) {
        if(!this.domainsFilled) return;

        event.preventDefault();

        var modalView = new Backbone.UILib.ModalView({
            model: this.model,
            selectorTmpl: '#block-info-modal-tmpl',
        });
        var selectView = new Backbone.UILib.SelectView({
            el: modalView.$('#pagos'),
            collection: this.options.domains.byCategory('pagamentos'),
        }).render();
        modalView.addAuxView(selectView);

        modalView.render();
    },

    remove: function () {
        Backbone.View.prototype.remove.call(this);
        _.invoke(this.subViews, 'remove');
    }

});
