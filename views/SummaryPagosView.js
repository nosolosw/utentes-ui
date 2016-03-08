Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SummaryPagosView = Backbone.View.extend({

  render: function(){
    if(this.model.get('pagos') === null){
      this.$el.removeClass('label-danger label-success').addClass('label-default');
    } else if (this.model.get('pagos')){
      this.$el.removeClass('label-success label-default').addClass('label-danger');
    } else{
      this.$el.removeClass('label-danger label-default').addClass('label-success');
    }
  }

});
