SIXHIARA.Views.SelectEstadoLicencia = Backbone.View.extend({

  render: function(){
    this.model.models.forEach(this.appendOption, this);
    return this;
  },

  appendOption: function(optionModel){
    var option = new iCarto.Views.Option({
      model: optionModel,
      text:  'text',
      attributes: {'value': optionModel.get('alias')}
    });
    this.$el.append(option.render().$el);
  },

});
