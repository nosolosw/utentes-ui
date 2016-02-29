Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonDeleteView = Backbone.View.extend({

  events: {
    "click": "doClick"
  },

  doClick: function(){
    
    this.model.destroy({
      // wait: true,
      success: function(model, resp, options) {
        window.location = '/static/utentes-ui/exploracao-search.html';
      },
      error: function(xhr, textStatus, errorThrown) {
        alert(textStatus.statusText);
      }
    });

  }

});
