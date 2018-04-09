Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFinancieiro3 = Backbone.SIXHIARA.ViewFacturacion.extend({


    /*
    Esto en realidad está por no  usar jquery. Si se hace en render todavía no están en el
    DOM los elementos y no se puede usar document ¿?. Con jquery en cambio se quedan
    binded para después al usar this.$
    */
    init: function() {
        Backbone.SIXHIARA.ViewFacturacion.prototype.init.call(this);

        document.getElementById('taxa_fixa').disabled = false;
        document.getElementById('taxa_uso').disabled = false;
        document.getElementById('iva').disabled = false;

        document.getElementById('pago_lic').disabled = false;
        // document.getElementById('pago_c_mes').disabled = false;

        document.getElementById('taxa_fixa').addEventListener('input', this.enableOkBt.bind(self));
        document.getElementById('taxa_uso').addEventListener('input', this.enableOkBt.bind(self));
        document.getElementById('iva').addEventListener('input', this.enableOkBt.bind(self));
        // document.getElementById('pago_c_mes').addEventListener('input', this.enableOkBt.bind(self));
        document.getElementById('pago_lic').addEventListener('input', this.enableOkBt.bind(self));

        document.getElementById('taxa_fixa').addEventListener('input', this.updatePagoMes);
        document.getElementById('taxa_uso').addEventListener('input', this.updatePagoMes);
        document.getElementById('iva').addEventListener('input', this.updatePagoMes);



        this.enableOkBt();
    },

    enableOkBt: function() {
        var enable = Boolean(Number.parseFloat(document.getElementById('taxa_fixa').value));
        enable = enable && Boolean(Number.parseFloat(document.getElementById('taxa_uso').value));
        enable = enable && Boolean(Number.parseFloat(document.getElementById('iva').value));
        // enable = enable && (this.getSelectText('pago_c_mes') === 'Si');
        // enable = enable && (this.getSelectText('pago_lic') === 'Si');

        document.getElementById('bt-ok').disabled = !enable;
    },



    fillExploracao: function(e) {
        // e será undefined si viene de saveData

        if (this.alreadySaved) {
            return;
        }
        var exploracao = this.model;

        var observacio = JSON.parse(exploracao.get('observacio'));

        var currentFact = observacio['facturacion'][observacio['facturacion'].length - 1];

        // var nextState = wf.whichNextState(observacio['state'], e);
        // pendiente_consumo debería setearse automaticamente al ppio del ciclo
        var nextState = wf.whichNextStateFact(currentFact.estado_facturacion, e);

        Object.assign(currentFact, {
            'taxa_fixa':Number.parseFloat(document.getElementById('taxa_fixa').value),
            'taxa_uso':Number.parseFloat(document.getElementById('taxa_uso').value),
            'iva':Number.parseFloat(document.getElementById('iva').value),
            'pago_mes':Number.parseFloat(document.getElementById('pago_mes').value),
            'pago_iva':Number.parseFloat(document.getElementById('pago_iva').value),
            // 'pago_c_mes': this.getSelectText('pago_c_mes'),
            'factura_emitida': 'Si',
            'pago_c_mes': 'Não',
            'pago_lic': this.getSelectText('pago_lic'),
            'estado_facturacion': nextState,
            'date_taxa': new Date(),
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

    updatePagoMes: function() {
        var taxa_fixa = Number.parseFloat(document.getElementById('taxa_fixa').value);
        var taxa_uso = Number.parseFloat(document.getElementById('taxa_uso').value);
        var c_facturado = Number.parseFloat(document.getElementById('c_facturado').value);
        var pago_mes = taxa_fixa + (taxa_uso * c_facturado);
        document.getElementById('pago_mes').value = pago_mes;

        var iva = Number.parseFloat(document.getElementById('iva').value);
        var pago_iva = pago_mes * (1 + iva / 100);
        document.getElementById('pago_iva').value = pago_iva;
    },

});
