Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SelectUtenteView = Backbone.View.extend({

  events: {
    'change #select-utente': "fillInputs"
  },

  render: function(){
    this.model.models.forEach(this.appendOption, this);

    return this;
  },

  appendOption: function(utente){
    var option = new Backbone.UILib.OptionView({
      model: utente,
      text:  'nome',
      attributes: {'value': utente.get('nome')}
    });
    this.$('#select-utente').append(option.render().$el);
  },

  fillInputs: function(e){
    // update widgets
    var selectedOption = e.target.selectedOptions[0].value;
    var utente = this.model.findWhere({'nome': selectedOption});
    this.$('.widget-utente').each(function(index, widget){
      if(utente === undefined){
        // enable widgets and clear values
        widget.removeAttribute('disabled');
        widget.value = '';
        $(widget).trigger('input');
      } else {
        // disable widgets and set values from model
        widget.setAttribute('disabled', true);
        widget.value = utente.get(widget.id);
        $(widget).trigger('input');
      }
    });
  }

});
