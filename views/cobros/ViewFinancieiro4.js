Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFinancieiro4 = Backbone.SIXHIARA.ViewFacturacion.extend({
    init: function() {
        Backbone.SIXHIARA.ViewFacturacion.prototype.init.call(this);
        document.getElementById('pago_lic').disabled = false;
    },

    fillExploracao: function(e) {
        var exploracao = this.model;

        var observacio = JSON.parse(exploracao.get('observacio'));
        // var nextState = wf.whichNextState(observacio['state'], e);
        var currentFact = observacio['facturacion'][observacio['facturacion'].length - 1];

        var nextState = wf.whichNextStateFact(currentFact.estado_facturacion, e);

        Object.assign(currentFact, {
            'estado_facturacion': nextState,
            'date_pagado': new Date(),
            'pago_c_mes': 'Si',
            'pago_lic': this.getSelectText('pago_lic'),
        });

        currentFact.comments = currentFact.comments || [];
        if (document.getElementById('observacio').value) {
            currentFact.comments.push({
                'create_at': new Date(),
                'author': wf.getUser(),
                'text': document.getElementById('observacio').value,
                'state': nextState,
            });
        }
        //observacio['facturacion'].push(currentFact);

        observacio['estado_facturacion'] = nextState;

        this.saveExploracao(observacio, nextState);
    },
});
