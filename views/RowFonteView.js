Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.RowFonteView = Backbone.View.extend({

  tagName: 'tr',

  template: _.template('<td><%- tipo_agua %></td><td><%- tipo_fonte %></td><td><%- c_requerid %></td><td><%- comentario %></td><td class="close">&times;</td>'),

  events:{
    'click .close': 'modelDestroy'
  },

  render: function(){
    this.$el.append(this.template(this.model.toJSON()));

    return this;
  },

  modelDestroy: function(){
    this.model.destroy();
  }

});
