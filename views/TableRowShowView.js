Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TableRowShowView = Backbone.View.extend({

  tagName: 'tr',

  template: _.template('<td><i class="fa fa-caret-down"></i></td><td><%- tipo_agua %></td><td><%- tipo_fonte %></td><td></td><td><%- c_requerid %></td><td></td><td></td><td></td><td></td><td><%- comentario %></td>'),

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
