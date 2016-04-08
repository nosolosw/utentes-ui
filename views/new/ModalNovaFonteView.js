Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ModalNovaFonteView = Backbone.View.extend({

  events: {
    'click #addFonte': 'addFonte'
  },

  addFonte: function(){
    this.collection.add(new Backbone.SIXHIARA.Fonte({
      'tipo_agua':  this.$('#tipo_agua').val(),
      'tipo_fonte': this.$('#fonte_tipo').val(),
      'c_soli':     formatter().unformatNumber(this.$('#c_soli').val()),
      'observacio': this.$('#observacio').val(),
    }));
    // close on click or let it open to enter several fontes?
    // this.$el.modal('toggle');
  },

});
