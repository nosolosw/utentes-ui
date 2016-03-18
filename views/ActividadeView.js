Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadeView = Backbone.View.extend({

  initialize: function(options){
    this.options = options || {};
    if(this.options.template){
      this.template = this.options.template;
    } else {
      throw {message: 'no template provided'};
    }
  },

  render: function(){
    this.$('#actividade').text(this.model.get('actividade').get('tipo') || 'Actividade non declarada');

    this.$('.actividade-render').html('');
    this.$('.actividade-render').append(this.template(this.model.get('actividade').toJSON()));

    return this;
  }

});