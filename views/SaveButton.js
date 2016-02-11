SIXHIARA.Views.SaveButton = Backbone.View.extend({

  events: {
    "click": "save"
  },

  save: function(){
    // TODO: save to API
    // make API configurable through config.js
    console.log(this.model.attributes);
  }

});
