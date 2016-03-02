Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.DomainCollection = Backbone.Collection.extend({

  model: Backbone.UILib.Domain,

  comparator: 'order',

  initialize: function(options) {
    this.options = options || {};
    this.url = this.options.url
  },

  byCategory: function(value){
    return new Backbone.UILib.DomainCollection(this.where({'category': value}));
  },

  byParent: function(value){
    return new Backbone.UILib.DomainCollection(this.where({'parent': value}));
  }

});
