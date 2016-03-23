Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadeView = Backbone.View.extend({

  initialize: function(options){
    this.options = options || {};
    if(this.options.template){
      this.template = this.options.template;
    } else {
      // throw {message: 'no template provided'};
    }
    this.options.domains = options.domains;
  },

  render: function(){
    var actividade = this.model.get('actividade');
    if(actividade){
      this.$('#actividade').text(this.model.get('actividade').get('tipo') || 'Actividade non declarada');
    } else{
      this.$('#actividade').text('Actividade non declarada');
    }

    this.$('.actividade-render').html('');
    if(this.template){
      this.$('.actividade-render').append(this.template(this.model.get('actividade').toJSON()));
    }

    if(this.options.domains){
      // TODO create as subviews
      new Backbone.UILib.SelectView({
        el: $('#tipo_indus'),
        collection: this.options.domains.byCategory('industria_tipo')
      }).render();
      new Backbone.UILib.SelectView({
        el: $('#energia_tipo'),
        collection: this.options.domains.byCategory('energia_tipo')
      }).render();
      new Backbone.UILib.SelectView({
        el: $('#eval_impac'),
        collection: this.options.domains.byCategory('boolean')
      }).render();
    }

    return this;
  }

});
