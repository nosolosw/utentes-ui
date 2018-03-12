$(document).ready(function() {
    $('#wizard-exp').bootstrapWizard({
        'withVisible': false
    });
});



var domains = new Backbone.UILib.DomainCollection();
domains.url = Backbone.SIXHIARA.Config.apiDomains;

domains.fetch({
    success: function(collection, response, options) {
        fillComponentsWithDomains();
    },
    error: function (collection, response, option) {
        console.log('error fetching domains');
        alert('error fetching domains');
    }
});

var utentes = new Backbone.SIXHIARA.UtenteCollection();
utentes.fetch({
    success: function(collection, response, options) {
        fillSelectUtente();
    },
    error: function (collection, response, options) {
        alert('error fetching utentes');
    }
});



// model to save
var exploracao = new Backbone.SIXHIARA.Exploracao();
var params = new URLSearchParams(document.location.search.substring(1));
var exp_id = params.get('exp_id');
if (exp_id) {
    exploracao.set('id', exp_id, {silent: true});
    exploracao.fetch({
        parse: true,
        success: function(){
            doIt();
        },
        error: function(){
            doIt();
        }
    });
} else {
    doIt();
}

function doIt() {
    // save action
    new Backbone.SIXHIARA.ButtonSaveView({
        el: $('#save-button'),
        model: exploracao
    }).render();

    // page info
    new Backbone.UILib.WidgetsView({
        el: $('#info'),
        model: exploracao
    }).render();

    // page utente
    new Backbone.UILib.WidgetsView({
        el: $('#utente'),
        model: exploracao.get('utente')
    }).render();

    // page licencias & fontes: superficial
    var licenseSupView = new Backbone.SIXHIARA.LicenseView({
        el: $('#licencia-superficial'),
        model: exploracao,
        domains: domains,
        lic_tipo: 'Superficial',
        selectorButtonAddFonte: '#fonte-superficial',
        selectorModalFonte: '#fonte-superficial-modal',
    }).render();

    // page licencias & fontes: subterranea
    var licenseSubView = new Backbone.SIXHIARA.LicenseView({
        el: $('#licencia-subterranea'),
        model: exploracao,
        domains: domains,
        lic_tipo: 'Subterrânea',
        selectorButtonAddFonte: '#fonte-subterranea',
        selectorModalFonte: '#fonte-subterranea-modal',
    }).render();

    // page licencias & fontes: fontes table
    var tableFontesView = new Backbone.SIXHIARA.TableView({
        el: $('#fontes'),
        collection: exploracao.get('fontes'),
        domains: domains,
        rowViewModel: Backbone.SIXHIARA.RowFonteView,
        noDataText: 'NON HAI FONTES',
    }).render();
    tableFontesView.listenTo(exploracao.get('fontes'), 'update', function(model, collection, options){
        this.update(exploracao.get('fontes'));
    });
}

function fillSelectUtente(){
    new Backbone.SIXHIARA.SelectUtenteView({
        el: $('#utente'),
        collection: utentes
    }).render();
}

function fillComponentsWithDomains(){

    var actividades = domains.byCategory('actividade');

    // page info: actividade
    new Backbone.UILib.SelectView({
        el: $('#actividade'),
        collection: actividades
    }).render();
    new Backbone.SIXHIARA.SelectActividadeView({
        el: $('#actividade-select'),
        model: exploracao
    });

    // page info: localizacao
    new Backbone.SIXHIARA.SelectLocationView({
        domains: domains,
        model: exploracao,
        domainsKeys: ['provincia', 'distrito', 'posto'],
        el: $('#info'),
    }).render();
    new Backbone.SIXHIARA.SelectBaciaView({
        domains: domains,
        model: exploracao,
        el: $('#info'),
    }).render();

    // page utente: localizacion
    new Backbone.SIXHIARA.SelectLocationView({
        domains: domains,
        model: exploracao.get('utente'),
        domainsKeys: ['utentes-provincia', 'utentes-distrito', 'utentes-posto'],
        el: $('#utente'),
    }).render();

    var selectUtenteTipo = new Backbone.UILib.SelectView({
        el: this.$('#uten_tipo'),
        collection: domains.byCategory('utentes_uten_tipo')
    }).render();

}
