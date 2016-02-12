iCarto.Views.SelectFiller = Backbone.View.extend({

  render: function(){
    this.model.models.forEach(this.appendOption, this);
    return this;
  },

  appendOption: function(optionModel){
    var alias = optionModel.get('alias');
    var option = new iCarto.Views.Option({
      model: optionModel,
      text:  'text',
      attributes: alias ? {'value': optionModel.get('alias')} : null
    });
    this.$el.append(option.render().$el);
  },

});
