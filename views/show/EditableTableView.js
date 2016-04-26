Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EditableTableView = Backbone.View.extend({

  initialize: function(options) {
    this.options = options || {};
    this._subviews = [];
    var self = this;
    $(this.options.newRowBtSelector || '#newRow').on('click', function(e){
      e.preventDefault();
      new Backbone.SIXHIARA.CultivoResModalView({
        modalSelectorTpl: self.options.modalSelectorTpl,
        collection: self.collection,
        collectionModel: self.options.collectionModel,
        model: new self.options.collectionModel(),
        domains: self.options.domains,
      }).show();
    });


    var tableView = new Backbone.SIXHIARA.TableView({
      el: $(this.options.tableSelector),
      collection: this.collection,
      rowTemplate: this.options.rowTemplate,
      modalSelectorTpl: this.options.modalSelectorTpl,
      domains: this.options.domains,
    }).render();

    this._subviews.push(tableView);

    tableView.listenTo(this.collection, 'add', function(model, collection, options){
      this.update(this.collection);
    });
    tableView.listenTo(this.collection, 'destroy', function(model, collection, options){
      this.update(this.collection);
    });
    tableView.listenTo(this.collection, 'change', function(model, collection, options){
      this.update(this.collection);
    });
  },

  remove: function(){
    this.off();
    _.invoke(this._subviews, 'off');
    _.invoke(this._subviews, 'remove');
    Backbone.View.prototype.remove.call(this);
  },

});


Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TableView = Backbone.View.extend({

  initialize: function(options){
    this.options = options || {}
    this.options.noDataText = options.noDataText || 'NON HAI ELEMENTOS'
    this._subviews = [];
  },

  render: function(){
    var subviews = [];
    var content = document.createDocumentFragment();

    this.collection.forEach(function(model){
      var rowView = new Backbone.SIXHIARA.RowView({
        model: model,
        rowTemplate: this.options.rowTemplate,
        modalSelectorTpl: this.options.modalSelectorTpl,
        domains: this.options.domains,
      });
      content.appendChild(rowView.render().el);
      subviews.push(rowView);
    }, this);

    // Update DOM and _subviews array at once.
    // This would minimize reflows to only 1 instead of one per subview.
    if(this.collection.length === 0){
      this.$('tbody').html(`<tr><td colspan="100%" class="TableView-nodata text-center">${this.options.noDataText}</td></tr>`);
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
    _.invoke(this._subviews, 'off');
    _.invoke(this._subviews, 'remove');
    Backbone.View.prototype.remove.call(this);
  },
});


Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.RowView = Backbone.View.extend({

  tagName: 'tr',

  events:{
    'click .delete': 'modelDestroy',
    'click .edit': 'modelEdit',
  },

  initialize: function(options) {
    this.options = options || {};
    this.template = _.template(options.rowTemplate);
  },

  render: function(){
    this.$el.append(this.template(this.model.toJSON()));

    return this;
  },

  modelDestroy: function(){
    // Unsets id to avoid send DELETE to server
    this.model.unset('id', {silent:true});
    this.model.destroy();
  },

  modelEdit: function(){
    new Backbone.SIXHIARA.CultivoResModalView({
      modalSelectorTpl: this.options.modalSelectorTpl,
      collection: this.collection,
      collectionModel: this.options.collectionModel,
      model: this.model,
      domains: this.options.domains,
      editing: true,
    }).show();
  },

});
