

function init() {
    document.querySelectorAll('form input[type="checkbox"]').forEach(function(input){
        input.addEventListener('change', enableOkBt);
    });

    document.getElementById('observacio').addEventListener('input', enableOkBt);
    document.getElementById('exp_name').addEventListener('input', enableOkBt);

    document.getElementById('js-btns-next').addEventListener('click', function(e){
        fillExploracao(e);
    });

    enableOkBt();

    $('[data-toggle="tooltip"]').tooltip();
}


function enableOkBt() {
    var enable = Array.from(
        document.querySelectorAll('form input[type="checkbox"]')
    ).every(input => {
        return ['licencia_ambiental', 'licencia_apertura'].indexOf(input.id) !== -1 || input.checked;
    });
    var observacio = document.getElementById('observacio');
    enable = enable && observacio && observacio.value && observacio.value.length >= 10;

    var exp_name = document.getElementById('exp_name');

    enable = enable && exp_name.value && exp_name.value.length > 3;
    document.getElementById('bt-ok').disabled = !enable;
};


function fillExploracao(e) {
    var exploracao = new Backbone.SIXHIARA.Exploracao();
    // Para que estén presentes en VistaTecnico1 sin que se rompa nada
    // y también en VistaJuridico2
    var json = {
        analisis_doc: false,
        sol_visita: false,
        parecer_unidade: false,
        parecer_tecnico: false,

        juri2_doc_legal: false,
        juri2_parecer_tecnico: false,
        juri2_parecer_relevantes: false,
        comments: [],

        consumo_tipo: 'Variável',

        pago_lic: 'Si',
        mensualidade_pagada: 'Si',

        estado_facturacion: 'pendiente_consumo',
        facturacion: []
    };
    // pagada, pendiente_factura, pendiente_consumo, pendiente_pago

    exploracao.set('observacio', JSON.stringify(json), {'silent': true});


    var observacio = JSON.parse(exploracao.get('observacio'));
    var nextState = wf.whichNextState('Não existe', e);
    observacio['comments'] = observacio['comments'] || [];
    observacio['comments'].push({
      'create_at': new Date(),
      'author': wf.getUser(),
      'text': document.getElementById('observacio').value,
      'state': nextState,
    });
    observacio['state'] = nextState;

    document.querySelectorAll('form input[type="checkbox"]').forEach(function(input){
        observacio[input.id] = input.checked;
        observacio[input.id + '_valido'] = false;
    });



    exploracao.urlRoot = '/api/requerimento';
    if (window.confirm(`A explotación vai mudar o seu estado a: ${nextState}`)) {
        exploracao.save(
            {
                'observacio': observacio,
                'exp_name': document.getElementById('exp_name').value,
            },
            {
                'patch': true,
                'validate': false,
                'wait': true,
                'success': function() {
                    window.alert('Los datos se han guardado correctamente');
                    window.location = '/static/utentes-ui/pendentes.html'
                },
                'error': function() {
                    window.alert('Se ha producido un error. Informe al administrador');
                },
            }
        );
    };

};


init();
