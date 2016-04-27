Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.RowFonteView = Backbone.View.extend({

  tagName: 'tr',

  template: _.template('<td><%- tipo_agua %></td><td><%- tipo_fonte %></td><td><% print(formatter().formatNumber(c_soli)) %></td><td><%- observacio %></td><td class="delete"><i class="fa fa-trash"></i></td>'),

  events:{
    'click .delete': 'modelDestroy'
  },

  render: function(){
    this.$el.append(this.template(this.model.toJSON()));

    return this;
  },

  modelDestroy: function(){
    this.model.destroy();
  }

});
