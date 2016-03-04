Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LicenciaView = Backbone.View.extend({

  initialize: function(options){
    this.options = options || {};
    if(this.options.template){
      this.template = this.options.template;
    } else {
      throw {message: 'no template provided'};
    }
  },

  render: function(){
    this.$el.append(this.template(this.model.toJSON()));

    return this;
  },

});
