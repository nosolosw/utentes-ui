Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ModalFonteView = Backbone.View.extend({

  events: {
    'click #addFonte': 'addFonte'
  },

  addFonte: function(){
    this.collection.add(new Backbone.SIXHIARA.Fonte({
      'tipo_agua':  this.$('#tipo_agua').val(),
      'tipo_fonte': this.$('#tipo_fonte').val(),
      'c_requerid': this.$('#c_requerid').val(),
      'comentario': this.$('#comentario').val(),
    }));
    // close on click or let it open to enter several fontes?
    // this.$el.modal('toggle');
  },

});
