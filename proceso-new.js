

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
    var observacio = {};
    document.querySelectorAll('form input[type="checkbox"]').forEach(function(input){
        observacio[input.id] = input.checked;
        observacio[input.id + '_valido'] = false;
    });

    // Para que estén presentes en VistaTecnico1 sin que se rompa nada
    // y también en VistaJuridico2
    Object.assign(observacio, {
        analisis_doc: false,
        sol_visita: false,
        parecer_unidade: false,
        parecer_tecnico: false,

        juri2_doc_legal: false,
        juri2_parecer_tecnico: false,
        juri2_parecer_relevantes: false,
    });

    var nextState = wf.whichNextState('Não existe', e);

    observacio['comments'] = observacio['comments'] || [];
    observacio['comments'].push({
      'create_at': new Date(),
      'author': wf.getUser(),
      'text': document.getElementById('observacio').value,
      'state': nextState,
    });


    observacio['state'] = nextState;

    var exploracao = new Backbone.SIXHIARA.Exploracao();
    exploracao.urlRoot = '/api/requerimento';

    exploracao.save(
        {
            'observacio': observacio,
            'exp_name': document.getElementById('exp_name').value,
        },
        {
            'patch': true,
            'validate': false
        }
    );
};


init();
