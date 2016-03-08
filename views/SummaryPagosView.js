Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SummaryPagosView = Backbone.View.extend({

  render: function(){
    var valid = this.model.get('pagos') || false;

    if(valid){
      this.$el.removeClass('label-danger').addClass('label-success');
    } else{
      this.$el.removeClass('label-success').addClass('label-danger');
    }
  }

});
