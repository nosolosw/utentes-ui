Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewTecnico3 = Backbone.SIXHIARA.ViewFacturacion.extend({



    /*
    Esto en realidad está por no  usar jquery. Si se hace en render todavía no están en el
    DOM los elementos y no se puede usar document ¿?. Con jquery en cambio se quedan
    binded para después al usar this.$
    */
    init: function() {
        var self = this;
        document.getElementById('c_facturado').disabled = false;

        document.getElementById('c_facturado').addEventListener('input', self.enableOkBt);

        document.getElementById('js-btns-next').addEventListener('click', function(e){
            self.fillExploracao(e);
        });

        self.enableOkBt();

        $('[data-toggle="tooltip"]').tooltip();
    },

    enableOkBt: function() {
        var enable;
        if (Number.parseFloat(document.getElementById('c_facturado').value)) {
            enable = true;
        }

        document.getElementById('bt-ok').disabled = !enable;
    },

    fillExploracao: function(e) {
        var exploracao = this.model;

        // var nextState = wf.whichNextState(observacio['state'], e);

        // pendiente_consumo debería setearse automaticamente al ppio del ciclo
        var nextState = wf.whichNextStateFact('pendiente_consumo', e)

        var observacio = JSON.parse(exploracao.get('observacio'));

        if (!observacio['facturacion']) {
            observacio['facturacion'] = [];
        }

        var currentFact = {
            'c_facturado': Number.parseFloat(document.getElementById('c_facturado').value),
            'estado_facturacion': nextState,
            'date_c_facturado': new Date(),
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
