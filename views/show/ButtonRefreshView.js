Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonRefreshView = Backbone.View.extend({

  events: {
    "click": "doClick"
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.enableButton);
    this.$el.prop('disabled', true);
  },

  doClick: function(){
    var refreshConfirmation = confirm('Se ele aceita perder alterações');
    if (refreshConfirmation) {
      window.location = this.model.urlShow();
    }
  },

  enableButton: function() {
    this.$el.prop('disabled', false);
  },

});
