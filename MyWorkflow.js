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

    fixVisibleProjects: function(where, exploracaos, domains) {
        exploracaos.on('sync', () => {
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

            if (this.activeView === undefined) {
                var viewClass = this.whichView(exploracaos.at(0));
                this.activeView = new viewClass({
                    model: exploracaos.at(0),
                });
                document.getElementById('insert-data').appendChild(this.activeView.render().el);
                this.activeView.init && this.activeView.init();
            }
        });
    },

    visibleState: function(state) {
        var user = this.getUser();
        var foo = json_estados.find((e) => e['key'] === state);
        return foo['roles'].indexOf(user) !== -1;
    },

    init: function() {
        wf.fixComboEstado(where, exploracaos, domains);
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

    renderView: function(exp) {
        this.activeView && this.activeView.remove && this.activeView.remove();
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
        return state1;
    },

    whichView: function(exp, next) {

        var state1 = this.getCurrentState(exp);
        var user = this.getUser();

        // if (state1 === 'No existe') {
        //     // user == administrativo || admin
        //     if (next == 'Bien') {
        //         return 'Pendente de revisão da solicitação (Direcção)';
        //     } else {
        //         return 'Irregular' || 'Pendente de solicitação do utente';
        //     }
        // }

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
            // admin, tecnico
            return Backbone.SIXHIARA.ViewTecnico1;
        }

        if ((user === 'administrativo') || (user === 'secretaria')) {
            return Backbone.SIXHIARA.View1;
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
    }

};


var json_estados = [
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
        'roles': ['admin', 'tecnico', 'juridico'],
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
        'roles': [],
    }
];

var wf = Object.create(MyWorkflow);

$(document).ready(function() {
    wf.fixMenu();
    if (window.location.pathname.split("/").pop() === 'pendentes.html') {
        wf.init();
    }
});
