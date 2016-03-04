Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TableRowShowView = Backbone.View.extend({

  tagName: 'tr',

  template: _.template('<td><i class="fa fa-caret-down"></i></td><td><%- tipo_agua %></td><td><%- tipo_fonte %></td><td><%- lat_lon %></td><td><%- c_soli %></td><td><%- c_max %></td><td><%- c_real %></td><td><% print(moment(d_dado).format("DD/MM/YYYY")) %></td><td><%- contador %></td><td><%- metodo_est %></td><td><%- comentario %></td>'),

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
