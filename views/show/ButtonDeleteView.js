Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonDeleteView = Backbone.View.extend({

  events: {
    "click": "doClick"
  },

  doClick: function(){
    var confirmation = confirm('Se você aceitar a exploração é excluído');
    if (!confirmation) return;

    this.model.destroy({
      // wait: true,
      success: function(model, resp, options) {
        window.location = Backbone.SIXHIARA.Config.urlSearch;
      },
      error: function(xhr, textStatus, errorThrown) {
        alert(textStatus.statusText);
      }
    });
  },

});
