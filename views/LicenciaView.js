Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LicenciaView = Backbone.View.extend({

  initialize: function(options){
    // TODO how to choose the license between the possible list?
    this.model = new Backbone.SIXHIARA.Licencia();
    if(this.collection.length > 0) this.model = this.collection[0];

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
