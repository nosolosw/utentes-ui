iCarto.Views.Option = Backbone.View.extend({

  tagName: 'option',

  initialize: function(options){
    this.options = options || {};
  },

  render: function(){
    this.$el.html(this.model.get(this.options.text));
    return this;
  }

  // TODO review
  // destroy: function(){
  //   this.$el.remove();
  //   this.model.destroy();
  // }

});
