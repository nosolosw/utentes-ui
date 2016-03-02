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
      var licsSup = licencias.where({'lic_tipo': 'Superficial'});
      var licsSub = licencias.where({'lic_tipo': 'Subterrânea'});

      if(licsSup.length > 0){
        new Backbone.UILib.WidgetsView({
          el: $('#licencia-superficial'),
          model: licsSup[0]
        }).render();
      }

      if(licsSub.length > 0) {
        new Backbone.UILib.WidgetsView({
          el: $('#licencia-subterranea'),
          model: licsSub[0]
        }).render();
      }

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

    },

    error: function(){
      console.log('could not load data');
      // TODO: show message
    }

  });

}
