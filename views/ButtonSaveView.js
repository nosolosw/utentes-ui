Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonSaveView = Backbone.View.extend({

  events: {
    "click": "save"
  },

  save: function(){

    // FIXME. If Licencia is Emtpy the object should no be serialized
    var lics = this.model.get('licencias');
    var long = 0;
    if (_.isArray(lics)) {
      long = lics.length
    } else {
      long = lics.models.length;
    }

    var to_remove = []
    for (var i = 0; i < long; i++) {
      if (! lics.at(i).get('estado') ) to_remove.push(lics.at(i));
    }

    lics.remove(to_remove);

    this.model.set('actividade', new Backbone.Model({tipo:this.model.get('actividade')}))
    // end of FIXME


    if(! this.model.isValid()) {
        alert(this.model.validationError);
        return;
    }

    this.model.save(null, {
      wait: true,
      success: function(model, resp, options) {
        window.location = model.urlShow();
      },
      error: function(xhr, textStatus, errorThrown) {
        alert(textStatus.statusText);
      }
    });

  }

});
