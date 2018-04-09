Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewTecnico3 = Backbone.SIXHIARA.ViewFacturacion.extend({



    /*
    Esto en realidad está por no  usar jquery. Si se hace en render todavía no están en el
    DOM los elementos y no se puede usar document ¿?. Con jquery en cambio se quedan
    binded para después al usar this.$
    */
    init: function() {
        Backbone.SIXHIARA.ViewFacturacion.prototype.init.call(this);

        var self = this;
        document.getElementById('c_facturado').disabled = false;
        document.getElementById('c_facturado').addEventListener('input', this.enableOkBt.bind(self));

        self.doEnableOkBt();
    },

    doEnableOkBt: function() {
        var enable;
        if (Number.parseFloat(document.getElementById('c_facturado').value)) {
            enable = true;
        }

        document.getElementById('bt-ok').disabled = !enable;
    },

    enableOkBt: function() {
        this.mustSave = true;
        this.doEnableOkBt();
    },

    fillExploracao: function(e) {
        // if (this.alreadySaved) {
        //     return;
        // }
        // if (!this.mustSave) {
        //     return;
        // }
        var exploracao = this.model;

        var observacio = JSON.parse(exploracao.get('observacio'));
        // var nextState = wf.whichNextState(observacio['state'], e);
        var currentFact = observacio['facturacion'][observacio['facturacion'].length - 1];

        var nextState = wf.whichNextStateFact(currentFact.estado_facturacion, e || {});

        Object.assign(currentFact, {
            'c_facturado': Number.parseFloat(document.getElementById('c_facturado').value),
            'estado_facturacion': nextState,
            'date_c_facturado': new Date(),
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
        // observacio['facturacion'].push(currentFact);

        observacio['estado_facturacion'] = nextState;

        this.saveExploracao(observacio, nextState);
    },
});
