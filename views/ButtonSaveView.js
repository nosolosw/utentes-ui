Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonSaveView = Backbone.View.extend({

  events: {
    "click": "save"
  },

  save: function(){

    // TODO: review this piece of code
    // move validations to model.validate
    // FIXME. If Licencia is Emtpy the object should no be serialized
    var lics = this.model.get('licencias');
    var long = 0;
    if (_.isArray(lics)) {
      long = lics.length
    } else {
      long = lics.models.length;
    }
    // what is this bucle for?
    for (var i = 0; i < long; i++) {
      if (! lics.at(0).get('estado') ) lics.remove(lics.at(0));
    }
    // end of TODO: review this piece of code

    if(! this.model.isValid()) {
        alert(this.model.validationError);
        return;
    }

    this.model.save(null, {
      wait: true,
      success: function(model, resp, options) {
        window.location = model.showUrl();
      },
      error: function(xhr, textStatus, errorThrown) {
        alert(textStatus.statusText);
      }
    });

  }

});
