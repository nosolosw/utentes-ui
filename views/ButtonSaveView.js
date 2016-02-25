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

    if(! this.model.isValid()) {
        alert(this.model.validationError);
        return;
    }

    this.model.save(null, {
      wait: true,
      success: function(model, resp, options) {
        window.location = '/static/utentes-ui/exploracao-show.html?id=' + model.get('id');
      },
      error: function(xhr, textStatus, errorThrown) {
        alert(textStatus.statusText);
      }
    });

  }

});
