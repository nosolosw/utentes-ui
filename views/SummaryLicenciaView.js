Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SummaryLicenciaView = Backbone.View.extend({

  render: function(){
    if(this.model.getSummaryEstado()){
      this.$el.removeClass('label-danger').addClass('label-success');
    } else{
      this.$el.removeClass('label-success').addClass('label-danger');
    }

    return this;
  }

});
