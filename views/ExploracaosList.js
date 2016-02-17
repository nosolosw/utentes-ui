SIXHIARA.Views.ExploracaosList = Backbone.View.extend({

  template: _.template($('#exploracao-li-tmpl').html()),

  render: function(){
    this.$el.html('');
    var app = this;
    this.model.models.forEach(function(element){
      app.$el.append(app.template({
        'exploracao_id': element.get('exp_id'),
        'exploracao_name': element.get('exp_name'),
        'utente_name': element.get('utente').get('nome'),
        'estado_licencia': 'L',
        'consumos': 'C',
        'pagos': 'P',
      }));
    })

    return this;
  }

});
