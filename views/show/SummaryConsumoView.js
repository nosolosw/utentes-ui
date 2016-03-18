Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SummaryConsumoView = Backbone.View.extend({

  render: function(){
    if(this.model.getSummaryConsumo()){
      this.$el.removeClass('label-danger').addClass('label-success');
    } else{
      this.$el.removeClass('label-success').addClass('label-danger');
    }

    return this;
  }

});
