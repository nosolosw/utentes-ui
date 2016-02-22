Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonSaveView = Backbone.View.extend({

  events: {
    "click": "save"
  },

  // render: function(){
  // },

  save: function(){
    c = new Backbone.SIXHIARA.ExploracaoCollection();
    c.create(this.model)
    // make API configurable through config.js
  }

});
