Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.CEstimadoComputedView = Backbone.View.extend({

  render: function(){
    var value = formatter().formatNumber(this.model.get('area')*0.25*86400*30/1000) || '';
    this.$el.val(value);

    return this;
  }

});
