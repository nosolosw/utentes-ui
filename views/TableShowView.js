Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TableShowView = Backbone.View.extend({

  initialize: function(){
    this._subviews = [];
  },

  render: function(){
    var subviews = [];
    var content = document.createDocumentFragment();

    this.collection.forEach(function(model){
      var rowView = new Backbone.SIXHIARA.TableRowShowView({
        model: model
      });
      content.appendChild(rowView.render().el);
      subviews.push(rowView);
    }, this);

    // Update DOM and _subviews array at once.
    // This would minimize reflows to only 1 instead of one per subview.
    if(this.collection.length === 0){
      this.$('tbody').html('<tr><td colspan="9" class="no-fontes text-center">NON HAI FONTES</td></tr>');
    } else{
      this.$('tbody').html(content);
    }
    _.invoke(this._subviews, 'remove');
    this._subviews = subviews;

    return this;
  },

  // Free old collection to be garbage collected after subviews are removed,
  // as each one has a reference to a model in the collection.
  update: function(newCollection){
    this.collection = newCollection;
    this.render();
  },

  // Remove the container element and then clean up its managed subviews
  // as to minimize document reflows.
  remove: function(){
    Backbone.View.prototype.remove.call(this);
    _.invoke(this._subviews, 'remove');
  }

});
