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

        exploracaos.on('sync', () => {
            var filtered = exploracaos.filter((e) => {
                var lics = e.get('licencias');
                var states = lics.pluck('estado');
                for (s of states) {
                    if (this.visibleState(s)) {
                        return true;
                    }
                }
            });
            var counter = document.getElementById('counter');
            // # exp que puede ver el utente / # total exp en la bd
            counter.innerHTML = `${filtered.length}/${exploracaos.length}`;

            exploracaos.reset(filtered);
            where.trigger('change', where);

            if (this.activeView === undefined) {
                console.log('und');
                this.activeView = this.whichView(exploracaos.at(0));
                document.getElementById('insert-data').appendChild(this.activeView.render().el);
            }

        });
    },

    visibleState: function(state) {
        var user = this.getUser();
        var foo = json_estados.find((e) => e['key'] === state);
        return foo['roles'].indexOf(user) !== -1;
    },

    init: function() {
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
        this.activeView.remove();
        this.activeView = this.whichView(exp);
        document.getElementById('insert-data').appendChild(this.activeView.render().el);
    },

    whichView: function(exp) {
        var lics = exp.get('licencias');
        var state1 = lics.at(0) && lics.at(0).get('estado');
        var state2 = lics.at(1) && lics.at(1).get('estado');
        var user = this.getUser();
        var view = null;

        if ((user === 'administrativo') || (user === 'secretaria')) {
            view = new Backbone.SIXHIARA.View1({
                model: exp,
            });
        } else {
            view = new Backbone.SIXHIARA.View1({
                model: exp,
            });
        }

        return view;
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
        'roles': ['admin', 'juridico'],
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

var wf = Object.create(MyWorkflow);

$(document).ready(function() {
    wf.fixMenu();
    if (window.location.pathname.split("/").pop() === 'pendentes.html') {
        wf.fixComboEstado(where, exploracaos, domains);
        wf.init();
    }
});
