iCarto.Views.ListView = Backbone.View.extend({

  // how to instantiate this view
  // it needs iCarto.Views.ItemView on its scope
  //
  // var listView = new iCarto.Views.ListView({
  //   collection: collection,
  //   el: el,
  //   subviewTemplate: subviewTemplate
  // });

  initialize: function(options){
    this.options = options || {};
    if(this.options.subviewTemplate){
      this.subviewTemplate = this.options.subviewTemplate;
    } else {
      throw {message: 'no subview template provided'};
    }

    this._subviews = [];
  },

  render: function(){
    _.invoke(this._subviews, 'remove');
    this._subviews = [];

    this.collection.forEach(function(model){
      var item = new iCarto.Views.ItemView({
        model: model,
        template: this.subviewTemplate
      });
      item.render();
      this.$el.append(item.$el);
      this._subviews.push(item);
    }, this);

    return this;
  },

  // Free old collection to be garbage collected
  // (after subviews are removed, as every view has a reference
  // to a model in the collection)
  update: function(newCollection){
    this.collection = newCollection;
    this.render();
  },

  // Remove the container element, and then clean up its managed subviews:
  remove: function(){
    Backbone.View.prototype.remove.call(this);
    _.invoke(this._subviews, 'remove');
  }

});
