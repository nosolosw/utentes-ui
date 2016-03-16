Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadeView = Backbone.View.extend({

  render: function(){
    this.$('#actividade').text(this.model.get('actividade').get('tipo') || 'Actividade non declarada');

    return this;
  }

});
