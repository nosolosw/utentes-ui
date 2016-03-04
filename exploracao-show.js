var exploracao = new Backbone.SIXHIARA.Exploracao();
exploracao.set('id', window.location.search.split('=')[1]);

var id = exploracao.get('id');
if((id === undefined) || (id === null) || (id === '')){

  // TODO: redirect to search
  populateFromFakeData(exploracaoShow);

} else {

  exploracao.fetch({
    parse: true,
    success: function(){

      // block info
      new Backbone.UILib.WidgetsView({
        el: $('#info'),
        model: exploracao
      }).render();

      // block loc-info
      new Backbone.UILib.WidgetsView({
        el: $('#loc-info'),
        model: exploracao
      }).render();

      // block utente
      new Backbone.UILib.WidgetsView({
        el: $('#utente'),
        model: exploracao.get('utente'),
      }).render();

      // block Licencias
      var licencias = exploracao.get('licencias');

      // TODO: how to choose the license between the possible list?
      var licSup = licencias.where({'lic_tipo': 'Superficial'})[0] || new Backbone.SIXHIARA.Licencia({'lic_tipo': 'Superficial'});
      new Backbone.SIXHIARA.LicenciaView({
        el: $('#licencia-superficial'),
        model: licSup,
        template: _.template($('#licencia-tmpl').html())
      }).render();

      // TODO: how to choose the license between the possible list?
      var licSub = licencias.where({'lic_tipo': 'Subterrânea'})[0] || new Backbone.SIXHIARA.Licencia({'lic_tipo': 'Subterrânea'});
      new Backbone.SIXHIARA.LicenciaView({
        el: $('#licencia-subterranea'),
        model: licSub,
        template: _.template($('#licencia-tmpl').html())
      }).render();

      // block fontes
      new Backbone.SIXHIARA.TableShowView({
        el: $('#fontes'),
        collection: exploracao.get('fontes'),
      }).render();

      // actions
      new Backbone.SIXHIARA.ButtonDeleteView({
        el: $('#delete-button'),
        model: exploracao
      });

      // map
      new Backbone.SIXHIARA.ExploracaoMapView({});
    },

    error: function(){
      console.log('could not load data');
      // TODO: show message
    }

  });

}
