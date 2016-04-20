Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonRefreshView = Backbone.View.extend({

  events: {
    "click": "doClick"
  },

  initialize: function() {
    this.$el.prop('disabled', true);
    this.listenTo(this.model, 'aChangeHappens', function(){
      this.$el.prop('disabled', false)
    }, this);
  },

  doClick: function(){
    var refreshConfirmation = confirm('Se ele aceita perder alterações');
    if (refreshConfirmation) {
      window.location = this.model.urlShow();
    }
  },

});
