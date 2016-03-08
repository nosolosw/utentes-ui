Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SummaryConsumoView = Backbone.View.extend({

  render: function(){
    var valid = false;
    valid = (this.model.get('c_licencia') >= this.model.get('c_real'));

    if(valid){
      this.$el.removeClass('label-danger').addClass('label-success');
    } else{
      this.$el.removeClass('label-success').addClass('label-danger');
    }
  }

});
