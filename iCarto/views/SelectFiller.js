iCarto.Views.SelectFiller = Backbone.View.extend({

  initialize: function(options){
    this.options = options || {};
  },

  render: function(){
    if(this.options.init){
      this.populateWith(this.options.init);
    } else{
      this.populateWith(this.model.models);
    }
    return this;
  },

  populateWith: function(options){
    if(options.length === 0){
      this.$el.prop('disabled', true);
    } else{
      this.$el.prop('disabled', false);
      options.forEach(this.appendOption, this);
    }
    // this would make the model to be updated
    // if it's listening to change events in view component
    // usually, this is done by Widgets.js
    this.$el.trigger('change');
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

  // callback to use if you want to re-render this component children
  // the values would be filtered from the model property 'parent'
  showFilteredOptions: function(model, value, options){
    this.$el.empty();
    var options = this.model.where({'parent': value});
    this.populateWith(options);
  },

});
