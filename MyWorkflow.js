var MyWorkflow = {

    VALID_LOGINS: ['admin', 'administrativo', 'financieiro', 'secretaria', 'tecnico', 'juridico'],
    USER_COOKIE_KEY: 'utentes_stub_user',

    getUser: function() {
        var user = document.cookie.replace(/(?:(?:^|.*;\s*)utentes_stub_user\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        return user;
    },

    setUser: function(user) {
        if (this.VALID_LOGINS.indexOf(user) == -1) {
            console.log('User not set. Valid users are:');
            console.log(this.VALID_LOGINS.join(', '));
        }
        document.cookie = 'utentes_stub_user=' + user;
    },

    delUser: function() {
        document.cookie = 'utentes_stub_user=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },

    fixMenu: function() {
        var user = this.getUser();

        var pendentes = this.createMenu('pendentes', 'pendentes.html', 'PENDENTES');
        document.getElementById('new').parentNode.before(pendentes);

        if (['admin', 'administrativo'].indexOf(user) !== -1) {
            var pendentes = this.createMenu('proceso-new', 'proceso-new.html', 'CRIAR');
            document.getElementById('utentes').parentNode.before(pendentes);
        }

        if (['admin', 'tecnico', 'financieiro'].indexOf(user) !== -1) {
            var pendentes = this.createMenu('cobros', 'cobros.html', 'FACTURAÇÃO');
            document.getElementById('pendentes').parentNode.before(pendentes);
        }

        if (['admin'].indexOf(user) === -1) {
            document.getElementById('new').parentNode.remove();
            document.getElementById('gps').parentNode.remove();

        }

        var activeItem = document.querySelectorAll('menu a.active');
        activeItem.length && activeItem[0].classList.remove('active');
        var currentHREF = window.location.pathname.split("/").pop();
        if (currentHREF === 'exploracao-show.html') {
            return;
        }
        var activeItem = document.querySelectorAll(`menu a[href="${currentHREF}"]`)[0];
        activeItem.classList.add('active');
    },

    createMenu: function(id, href, title) {
        var menuItem = document.createElement('a');
        menuItem.classList.add('col-xs-1', 'pull-right', 'text-center');
        menuItem.href = href;
        menuItem.innerHTML = `<strong id="${id}">${title}</strong>`;
        return menuItem;
    },

    fixComboEstado: function(where, exploracaos, domains) {
        domains.on('sync', () => {
            // https://stackoverflow.com/a/23989142/930271
            var options = document.getElementById('estado').querySelectorAll('option');
            for (option of options) {
                if (!this.visibleState(option.value)) {
                    option.remove();
                }
            };
        });
    },

    fixComboPagamento: function(where, exploracaos, domains) {
        var user = this.getUser();
        domains.on('sync', () => {
            var pagos = document.getElementById('pagos');
            while (pagos.firstChild) {
                pagos.removeChild(pagos.firstChild);
            }
            json_pagos.forEach((e) => {
                if (e.roles.indexOf(user) !== -1) {
                    var option = document.createElement('option')
                    option.text = e.key;
                    pagos.appendChild(option);
                }
            });
        });
    },

    fixVisibleProjects: function(where, exploracaos, domains) {
        exploracaos.on('sync', () => {

            // TODO. BORRAR
            exploracaos.forEach((e) => {
                var json;
                try {
                    json = JSON.parse(e.get('observacio') || '')
                } catch (exc) {
                    // console.log(exc);
                    json = {
                        analisis_doc: false,
                        sol_visita: false,
                        parecer_unidade: false,
                        parecer_tecnico: false,

                        juri2_doc_legal: false,
                        juri2_parecer_tecnico: false,
                        juri2_parecer_relevantes: false,
                        comments: [],

                        consumo_tipo: 'Variável',

                        pago_lic: 'Não',
                        pago_c_mes: 'Não',
                        estado_facturacion: 'pendiente_consumo',
                    };
                    e.set('observacio', JSON.stringify(json), {'silent': true});
                }

                if ( e.get('licencias').at(0) && e.get('licencias').at(0).get('estado') === 'Licenciada' ) {
                    e.set('pago_iva', e.get('licencias').at(0).get('pago_iva'), {'silent': true});
                    e.set('pago_mes', e.get('licencias').at(0).get('pago_mes'), {'silent': true});
                    e.set('taxa_fixa', e.get('licencias').at(0).get('taxa_fixa'), {'silent': true});
                    e.set('taxa_uso', e.get('licencias').at(0).get('taxa_uso'), {'silent': true});
                    e.set('iva', e.get('licencias').at(0).get('iva'), {'silent': true});
                } else if (e.get('licencias').at(1) && e.get('licencias').at(1).get('estado') === 'Licenciada' ) {
                    e.set('pago_iva', e.get('licencias').at(1).get('pago_iva'), {'silent': true});
                    e.set('pago_mes', e.get('licencias').at(1).get('pago_mes'), {'silent': true});
                    e.set('taxa_fixa', e.get('licencias').at(1).get('taxa_fixa'), {'silent': true});
                    e.set('taxa_uso', e.get('licencias').at(1).get('taxa_uso'), {'silent': true});
                    e.set('iva', e.get('licencias').at(1).get('iva'), {'silent': true});
                }
            });



            var filtered = exploracaos.filter((e) => {
                // var lics = e.get('licencias');
                // var states = lics.pluck('estado');
                // for (s of states) {
                //     if (this.visibleState(s)) {
                //         return true;
                //     }
                // }
                var state = this.getCurrentState(e);
                return this.visibleState(state);
            });
            var counter = document.getElementById('counter');
            // # exp que puede ver el utente / # total exp en la bd
            counter.innerHTML = `${filtered.length}/${exploracaos.length}`;

            exploracaos.reset(filtered);
            where.trigger('change', where);

            if (exploracaos.length > 0) {
                this.renderView(exploracaos.at(0));
            }
        });
    },

    visibleState: function(state) {
        if (this.available_states_for_this_page.indexOf(state.state) === -1) {
            return false;
        }

        var user = this.getUser();
        var foo = json_estados.find((e) => e['key'] === state.state);
        if (foo['roles'].indexOf(user) === -1) {
            return false;
        }

        if (state.state === 'Licenciada') {

            var bar = json_pagos.find((e) => e['key'] === state.pagos);
            if (bar['roles'].indexOf(user) === -1) {
                return false;
            }
        }

        // return foo['roles'].indexOf(user) !== -1;
        return true;
    },

    init: function(available_states_for_this_page) {
        // se podrían intersecar con los del usuario
        this.available_states_for_this_page = available_states_for_this_page;
        // En realidad estoy metiendo que tecnico puede ver licenciadas, sólo para la vista de cobros
        // se podría hacer que sólo técnico, admin, financieiro puedan acceder a esa vista y no controlar
        // por estado. O no. Por el tema de pagado/no pagado
        wf.fixComboEstado(where, exploracaos, domains);
        wf.fixComboPagamento(where, exploracaos, domains);
        wf.fixVisibleProjects(where, exploracaos, domains);
        document.getElementById('projects').addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'a') {
                var exp_id = e.target.parentNode.parentNode.id.replace('exp_id-', '');
                var exp = exploracaos.findWhere({'exp_id': exp_id});
                this.renderView(exp);
            }
            return false;
        });
    },

    // initOnUnload: function() {
    //     var self = this;
    //     window.onbeforeunload = function() {
    //         self.activeView && self.activeView.saveData && self.activeView.saveData();
    //     };
    // },

    renderView: function(exp) {
        if (this.activeView) {
            // if (this.activeView.saveData) {
            //     this.activeView.saveData();
            // }
            if (this.activeView.remove) {
                this.activeView.remove();
            }
        }

        var viewClass = this.whichView(exp);
        this.activeView = new viewClass({
            model: exp,
        });
        document.getElementById('insert-data').appendChild(this.activeView.render().el);
        this.activeView.init && this.activeView.init();
    },

    getCurrentState: function(exp) {
        var lics = exp.get('licencias');
        var state1 = (lics.at(0) && lics.at(0).get('estado')) || 'Não existe';
        var state2 = (lics.at(1) && lics.at(1).get('estado')) || 'Não existe';

        state1 = state1 !== 'Não existe' ? state1 : state2;

        var json = JSON.parse(exp.get('observacio')) || {};

        state1 = json['state'] || state1;

        var pagos = json['estado_facturacion'];
        return {
            state: state1,
            pagos: pagos,
        };
    },

    whichView: function(exp, next) {

        var currentState = this.getCurrentState(exp);
        var state1 = currentState.state;
        var user = this.getUser();

        if (state1 === 'Pendente de revisão da solicitação (Direcção)') {
            // user === secretaria || admin
            return Backbone.SIXHIARA.ViewSecretaria1
        }

        if (state1 === 'Pendente de revisão da solicitação (D. Jurídico)') {
            if (user === 'juridico') {
                return Backbone.SIXHIARA.ViewJuridico1;
            };
            if (user === 'tecnico') {
                return Backbone.SIXHIARA.ViewJuridicoNotEditable1;
            };
        }

        if (state1 === 'Pendente de revisão da solicitação (Chefe DT)') {
            /*
             admin, tecnico. Hay que ponerlo. Si no, si por ejemplo jurídico
             pudiera ver este estado se le estaría renderizando esto.
            */
            return Backbone.SIXHIARA.ViewTecnico1;
        }

        if (state1 === 'Pendente da emisão (D. Jurídico)') {
            // admin, juridico
            return Backbone.SIXHIARA.ViewJuridico2;
        }

        if (state1 === 'Pendente da firma (Direcção)') {
            // admin, secretaria
            return Backbone.SIXHIARA.ViewSecretaria2;
        }

        if (state1 === 'Licenciada') {
            if (currentState.pagos === 'pendiente_consumo') {
                // admin, tecnico
                return Backbone.SIXHIARA.ViewTecnico3
            }
            if (currentState.pagos === 'pendiente_factura') {
                // admin, financieiro
                return Backbone.SIXHIARA.ViewFinancieiro3
            }
            if (currentState.pagos === 'pendiente_pago') {
                // admin, financieiro
                return Backbone.SIXHIARA.ViewFinancieiro4
            }
            if (currentState.pagos === 'pagada') {
                console.log('Esto no debería pasar')
            }
        }

        return Backbone.SIXHIARA.UpsView;

    },


    /*
    TODO: Esto debería ir en MyWorkflow
    * Tiene sentido tener un estado para la licencia y otro estado para la explotación/workflow
    * Podría haber una tabla workflow que mantuviera todos los cambios. Iría con fk sobre explotación y la explotación sólo tendría en cuenta el último

    Si no en este punto tendría que crear la licencia(s), aunque fuera empty, setear
    {
    lic_tipo: 'Desconhecido',
    lic_nro: Inventar,
    estado: nextState,
    exploracao: la nueva explotación
    }
    Con una tabla de requerimento esto no es necesario, sigue un flujo distinto, y le podría poner el estado directamente al requerimento
    */
    whichNextState: function(currentState, data) {
        // Igual en lugar de currentState se le puede pasar la explotación

        if (currentState === 'Não existe') {
            return this.nextStateAfterNoExiste(data)
        }

        if (currentState === 'Pendente de revisão da solicitação (Direcção)') {
            return this.nextStateAfterPteRevDir(data)
        }

        if (currentState === 'Pendente de revisão da solicitação (D. Jurídico)') {
            return this.nextStateAfterPteRevJuri(data);
        }

        if (currentState === 'Pendente de revisão da solicitação (Chefe DT)') {
            return this.nextStateAfterPteRevDT(data);
        }

        if (currentState === 'Pendente da emisão (D. Jurídico)') {
            return this.nextStatePteEmiJuri(data);
        }

        if (currentState === 'Pendente da firma (Direcção)') {
            return this.nextStatePteFirmaDir(data);
        }

        if (currentState === 'Licenciada') {
            return 'Licenciada';
        }
    },

    nextStateAfterNoExiste: function(data) {
        // si user no es admin o administrativo error
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = 'Pendente de revisão da solicitação (Direcção)';
        }
        if (data.target.id === 'bt-falta') {
            nextState = 'Pendente de solicitação do utente';
        }
        if (data.target.id === 'bt-no') {
            // igual administrativo no debería tener permiso para esta opción
            nextState = 'Não aprovada';
        }
        return nextState;
    },

    nextStateAfterPteRevDir: function(data) {
        // si user no es admin o secretaria error
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = 'Pendente de revisão da solicitação (D. Jurídico)';
        }

        if (data.target.id === 'bt-no') {
            // igual secretaria no debería tener permiso para esta opción
            nextState = 'Não aprovada';
        }
        return nextState;
    },

    nextStateAfterPteRevJuri: function(data) {
        // si user no es admin o juridico error
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = 'Pendente de revisão da solicitação (Chefe DT)';
        }

        if (data.target.id === 'bt-no') {
            // igual secretaria no debería tener permiso para esta opción
            nextState = 'Não aprovada';
        }
        return nextState;
    },

    nextStateAfterPteRevDT: function(data) {
        // si user no es admin o tecnico error
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = 'Pendente da emisão (D. Jurídico)';
        }

        if (data.target.id === 'bt-no') {
            // igual secretaria no debería tener permiso para esta opción
            nextState = 'Não aprovada';
        }
        return nextState;
    },

    nextStatePteEmiJuri: function(data) {
        // si user no es admin o tecnico error
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = 'Pendente da firma (Direcção)';
        }

        if (data.target.id === 'bt-no') {
            // igual secretaria no debería tener permiso para esta opción
            nextState = 'Não aprovada';
        }
        return nextState;
    },

    nextStatePteFirmaDir: function(data) {
        // si user no es admin o tecnico error
        var nextState = undefined;
        if (data.target.id === 'bt-ok') {
            nextState = 'Licenciada';
        }

        if (data.target.id === 'bt-no') {
            nextState = 'Não aprovada';
        }
        return nextState;
    },

    whichNextStateFact: function(currentState, data) {
        // puede tener sentido agrupar en whichNextState
        var nextState = undefined;
        if (!data.target) {
            return currentState;
        }

        if (data.target.id === 'bt-no') {
            throw "This should not happen";
        }

        // pendiente_consumo, pendiente_factura, pendiente_pago, pagada
        if (currentState === '') {

        } else if (currentState === 'pendiente_consumo') {
            if (data.target.id === 'bt-ok') {
                nextState = 'pendiente_factura';
            }
        } else if (currentState === 'pendiente_factura') {
            if (data.target.id === 'bt-ok') {
                nextState = 'pendiente_pago';
            }
        } else if (currentState === 'pendiente_pago') {
            if (data.target.id === 'bt-ok') {
                nextState = 'pagada';
            }
        } else if (currentState === 'pagada') {
            if (data.target.id === 'bt-ok') {
                throw "This should not happen";
            }
        } else {
            throw "This should not happen";
        }

        return nextState;
    },


    _test_set_state(exp_id, nextState) {
        var exploracao = exploracaos.findWhere({'exp_id': exp_id});
        var observacio = JSON.parse(exploracao.get('observacio'));
        observacio['state'] = nextState;

        exploracao.urlRoot = '/api/requerimento';
        exploracao.save(
            {
                'observacio': observacio,
            },
            {
                'patch': true,
                'validate': false,
                'wait': true,
                'success': function() {
                    console.log('Los datos se han guardado correctamente');
                },
                'error': function() {
                    console.log('Se ha producido un error. Informe al administrador');
                },
            }
        );
    },

};


var json_estados = [
    {
        'category': 'licencia_estado',
        'key': "Não existe",
        'value': "BORRAR",
        'ordering': 0,
        'parent': 'precampo',
        'tooltip': null,
        'app': null,
        'roles': [],
    },

    {
        'category': 'licencia_estado',
        'key': "",
        'value': "",
        'ordering': 0,
        'parent': 'precampo',
        'tooltip': null,
        'app': null,
        'roles': ['admin', 'administrativo', 'financieiro', 'secretaria', 'tecnico', 'juridico'],
    },
    {
        'category': 'licencia_estado',
        'key': 'Irregular',
        'value': null,
        'ordering': 1,
        'parent': 'precampo',
        'tooltip': 'A licença encontra-se num estado irregular (Incumplimieto dos acordos)\n',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'administrativo', 'financieiro', 'secretaria', 'tecnico', 'juridico'],
    },
    {
        'category': 'licencia_estado',
        'key': 'Desconhecido',
        'value': null,
        'ordering': 1,
        'parent': 'precampo',
        'tooltip': null,
        'app': [
            'DPMAIP'
        ],
        'roles': ['admin', 'administrativo', 'financieiro', 'secretaria', 'tecnico', 'juridico'],
    },
    {
        'category': 'licencia_estado',
        'key': 'Não aprovada',
        'value': null,
        'ordering': 2,
        'parent': 'precampo',
        'tooltip': 'A licença foi negada por não cumprir os requisitos\n',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'administrativo', 'financieiro', 'secretaria', 'tecnico', 'juridico'],
    },
    {
        'category': 'licencia_estado',
        'key': 'Pendente de solicitação do utente',
        'value': null,
        'ordering': 3,
        'parent': 'precampo',
        'tooltip': 'O utente ainda não tem entregado a carta de solicitação',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'administrativo', 'financieiro', 'secretaria'],
    },
    {
        'category': 'licencia_estado',
        'key': 'Pendente de revisão da solicitação (Direcção)',
        'value': null,
        'ordering': 4,
        'parent': 'precampo',
        'tooltip': 'O utente tem entregado a solicitação. Pendente de revisão por direcção',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'secretaria'],
    },
    {
        'category': 'licencia_estado',
        'key': 'Pendente de revisão da solicitação (Chefe DT)',
        'value': null,
        'ordering': 5,
        'parent': 'precampo',
        'tooltip': 'O utente tem entregado a solicitação. Pendente de revisão pelo chefe do Departamento Técnico',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'tecnico'],
    },
    {
        'category': 'licencia_estado',
        'key': 'Pendente de revisão da solicitação (D. Jurídico)',
        'value': null,
        'ordering': 6,
        'parent': 'precampo',
        'tooltip': 'O utente tem entregado a solicitação. Pendente de revisão pelo departamento jurídico',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'tecnico', 'juridico'],
    },
    {
        'category': 'licencia_estado',
        'key': 'Pendente de aprovação técnica (R. Cadastro)',
        'value': null,
        'ordering': 7,
        'parent': 'precampo',
        'tooltip': 'Pendente que os técnicos do departamento de cadastro saiam a terreno a realizar a avaliação técnica e entrevista com o utente',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'administrativo', 'financieiro', 'secretaria', 'tecnico', 'juridico'],
    },
    {
        'category': 'licencia_estado',
        'key': 'Pendente de aprovação técnica (Chefe DT)',
        'value': null,
        'ordering': 8,
        'parent': 'postcampo',
        'tooltip': 'Avaliação técnica e entrevista realizada. Pendente revisão e aprovação pelo chefe do Departamento Técnico',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'tecnico', 'juridico'],
    },
    {
        'category': 'licencia_estado',
        'key': 'Pendente da emisão (D. Jurídico)',
        'value': null,
        'ordering': 9,
        'parent': 'postcampo',
        'tooltip': 'Pendente de revisão e emissão da licença pelo departamento jurídico',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'juridico'],
    },
    {
        'category': 'licencia_estado',
        'key': 'Pendente da firma (Direcção)',
        'value': null,
        'ordering': 10,
        'parent': 'postcampo',
        'tooltip': 'Licença emitida. Pendente da revisão e assinatura de direcção para sua aprovação definitiva.',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'secretaria'],
    },
    {
        'category': 'licencia_estado',
        'key': 'Licenciada',
        'value': null,
        'ordering': 11,
        'parent': 'postcampo',
        'tooltip': 'Licença concedida, em activo e com funcionamento regular\n',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'administrativo', 'financieiro', 'secretaria', 'tecnico', 'juridico'],
    }
];

json_pagos = [
    {
        'category': 'pago_estado',
        'key': 'pendiente_consumo',
        'value': null,
        'ordering': 0,
        'parent': null,
        'tooltip': 'El técnico debe introducir el valor de consumo de este mes',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'tecnico'],
    },
    {
        'category': 'pago_estado',
        'key': 'pendiente_factura',
        'value': null,
        'ordering': 1,
        'parent': null,
        'tooltip': 'El financieiro debe introducir las taxas del mes y emitir la factura',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'financieiro'],
    },
    {
        'category': 'pago_estado',
        'key': 'pendiente_pago',
        'value': null,
        'ordering': 2,
        'parent': null,
        'tooltip': 'El utente debe pagar la factura',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': ['admin', 'financieiro'],
    },
    {
        'category': 'pago_estado',
        'key': 'pagada',
        'value': null,
        'ordering': 3,
        'parent': null,
        'tooltip': 'El utente ya ha pagado la factura de este mes',
        'app': [
            'Norte',
            'Sul'
        ],
        'roles': [],
    }
]

var wf = Object.create(MyWorkflow);

$(document).ready(function() {
    wf.fixMenu();
    var page = window.location.pathname.split("/").pop();
    // ["Não existe", 'Irregular', 'Desconhecido', 'Não aprovada',
    //  'Pendente de solicitação do utente', 'Pendente de revisão da solicitação (Direcção)',
    //  'Pendente de revisão da solicitação (Chefe DT)', 'Pendente de revisão da solicitação (Chefe DT)',
    //  'Pendente de revisão da solicitação (D. Jurídico)', 'Pendente de aprovação técnica (R. Cadastro)',
    //  'Pendente de aprovação técnica (Chefe DT)', 'Pendente da emisão (D. Jurídico)',
    //  'Pendente da emisão (D. Jurídico)', 'Pendente da firma (Direcção)', 'Licenciada' ]
    if (page === 'pendentes.html') {
        var available_states_for_this_page = ["Não existe", 'Irregular', 'Desconhecido', 'Não aprovada',
         'Pendente de solicitação do utente', 'Pendente de revisão da solicitação (Direcção)',
         'Pendente de revisão da solicitação (Chefe DT)', 'Pendente de revisão da solicitação (Chefe DT)',
         'Pendente de revisão da solicitação (D. Jurídico)', 'Pendente de aprovação técnica (R. Cadastro)',
         'Pendente de aprovação técnica (Chefe DT)', 'Pendente da emisão (D. Jurídico)',
         'Pendente da emisão (D. Jurídico)', 'Pendente da firma (Direcção)']
        wf.init(available_states_for_this_page);
    } else if (page === 'cobros.html') {
        var available_states_for_this_page = ['Licenciada']
        wf.init(available_states_for_this_page);
        // wf.initOnUnload();
    }

});
