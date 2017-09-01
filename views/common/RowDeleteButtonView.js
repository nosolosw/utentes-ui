Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.RowDeleteButtonView = Backbone.View.extend({

    events: {
        "click": "doClick"
    },

      /*
      options.question: text asked to the user before destroying the model
      */
    initialize: function(options){
        this.options = options || {};
    },

    doClick: function() {
        if (this.options.question) {
            var confirmation = confirm(this.options.question);
            if (!confirmation) return;
        }

        // Unsets id to avoid send DELETE to server
        this.model.unset('id', {silent:true});
        this.model.destroy();
    },

});
