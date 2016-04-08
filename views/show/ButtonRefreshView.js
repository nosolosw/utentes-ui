Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonRefreshView = Backbone.View.extend({

  events: {
    "click": "doClick"
  },

  doClick: function(){
    var refreshConfirmation = confirm('Se ele aceita perder alterações');
    if (refreshConfirmation) {
      window.location = this.model.urlShow();
    }
  },

});
