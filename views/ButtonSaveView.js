Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonSaveView = Backbone.View.extend({

  events: {
    "click": "save"
  },

  // render: function(){
  // },

  save: function(){

    // FIXME. If Licencia is Emtpy the object should no be serialized
    var lics = this.model.get('licencias');
    var long = 0;
    if (_.isArray(lics)) {
        long = lics.length
    } else {
        long = lics.models.length;
    }

    for (var i = 0; i < long; i++) {
      if (! lics.at(0).get('lic_nro') ) lics.remove(lics.at(0));
    }


    c = new Backbone.SIXHIARA.ExploracaoCollection();
    c.create(this.model)
    // make API configurable through config.js
  }

});
