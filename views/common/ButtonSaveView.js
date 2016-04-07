Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonSaveView = Backbone.View.extend({

  events: {
    "click": "save"
  },

  save: function(){

    if(this.model.isValid()){
      this.model.save(null, {
        wait: true,
        success: function(model, resp, options) {
          window.location = model.urlShow();
        },
        error: function(xhr, textStatus, errorThrown) {
          if (textStatus && textStatus.responseJSON && textStatus.responseJSON.error) {
            if(Array.isArray(textStatus.responseJSON.error)) {
              alert(textStatus.responseJSON.error.join('\n'));
            } else{
              alert(textStatus.responseJSON.error);
            }
          } else {
            alert(textStatus.statusText);
          }
        }
      });
    } else {
      alert(this.model.validationError.join('\n'));
    }

  }

});
