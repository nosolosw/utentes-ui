SIXHIARA.Models.Where = SIXHIARA.Models.ExploracaoSummary.extend({

  values: function(){
    // only return those pairs that are not void
    return _.omit(this.toJSON(), function(value, key, object){
      return value === '';
    });
  },

});
