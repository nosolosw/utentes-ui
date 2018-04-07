Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFinancieiro4 = Backbone.SIXHIARA.ViewFacturacion.extend({

    fillExploracao: function(e) {
        var exploracao = this.model;

        var observacio = JSON.parse(exploracao.get('observacio'));
        // var nextState = wf.whichNextState(observacio['state'], e);

        var nextState = wf.whichNextStateFact(observacio['facturacion'][observacio['facturacion'].length - 1].estado_facturacion, e);


        var currentFact = {
            'estado_facturacion': nextState,
            'date_pagado': new Date(),
        };

        currentFact.comments = currentFact.comments || [];
        if (document.getElementById('observacio').value) {
            currentFact.comments.push({
                'create_at': new Date(),
                'author': wf.getUser(),
                'text': document.getElementById('observacio').value,
                'state': nextState,
            });
        }
        observacio['facturacion'].push(currentFact);

        observacio['estado_facturacion'] = nextState;

        this.saveExploracao(observacio, nextState);
    },
});
