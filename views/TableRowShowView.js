Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TableRowShowView = Backbone.View.extend({

  tagName: 'tr',

  template: _.template('<td><%- tipo_agua %></td><td><%- tipo_fonte %></td><td><%- lat_lon %></td><td><% print(formatter().formatNumber(c_soli)) %></td><td><% print(formatter().formatNumber(c_max)) %></td><td><% print(formatter().formatNumber(c_real)) %></td><td><% print(formatter().formatDate(d_dado)) %></td><td><% print(formatter().formatBoolean(contador)) %></td><td><%- metodo_est %></td><td><%- observacio %></td><td><button type="button" class="btn btn-default btn-xs">Editar</button> <button type="button" class="delete-fonte btn btn-default btn-xs">Eliminar</button></td>'),

  events:{
    'click .delete-fonte': 'modelDestroy'
  },

  initialize: function(){
    this.model.on('remove', this.unrender, this);
  },

  render: function(){
    this.$el.append(this.template(this.model.toJSON()));

    return this;
  },

  unrender: function(){
    this.$el.remove();
  },

  modelDestroy: function(){
    this.model.collection.remove(this.model);
  }

});
