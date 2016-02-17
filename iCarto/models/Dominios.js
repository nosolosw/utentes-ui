iCarto.Collections.Dominios = Backbone.Collection.extend({

  model: iCarto.Models.Dominio,

  comparator: 'order',

  byCategory: function(value){
      return new iCarto.Collections.Dominios(this.where({'category': value}));
  }

});
