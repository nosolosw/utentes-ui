Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EditableTableView = Backbone.View.extend({

  initialize: function(options) {
    this.options = options || {};
    this._subviews = [];
    var self = this;
    $(this.options.newRowBtSelector || '#newRow').on('click', function(e){
      e.preventDefault();
      $(self.options.modalSelector).modal('toggle');
    });

    this._subviews.push(
      new Backbone.SIXHIARA.ModalTableView({
        el: $(this.options.modalSelector),
        collection: this.collection,
      })
    );

    var tableView = new Backbone.SIXHIARA.TableView({
      el: $(this.options.tableSelector),
      collection: this.collection,
      rowTemplate: this.options.rowTemplate,
      editModalSelector: this.options.editModalSelector,
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
    Backbone.View.prototype.remove.call(this);
    _.invoke(this._subviews, 'unbind');
    _.invoke(this._subviews, 'remove');
  },

});


Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TableView = Backbone.View.extend({

  initialize: function(options){
    this.options = options || {}
    this._subviews = [];
  },

  render: function(){
    var subviews = [];
    var content = document.createDocumentFragment();

    this.collection.forEach(function(model){
      var rowView = new Backbone.SIXHIARA.RowView({
        model: model,
        rowTemplate: this.options.rowTemplate,
        editModalSelector: this.options.editModalSelector,
      });
      content.appendChild(rowView.render().el);
      subviews.push(rowView);
    }, this);

    // Update DOM and _subviews array at once.
    // This would minimize reflows to only 1 instead of one per subview.
    if(this.collection.length === 0){
      this.$('tbody').html('<tr><td colspan="5" class="TableView-nodata text-center">NON HAI ELEMENTOS</td></tr>');
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
  },
});


Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.RowView = Backbone.View.extend({

  tagName: 'tr',

  events:{
    'click .close': 'modelDestroy',
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
    $(this.options.editModalSelector).modal('toggle');

    new Backbone.SIXHIARA.EditModalTableView({
      el: $(this.options.editModalSelector),
      model: this.model,
    });

    var self = this;
    $(self.options.editModalSelector).one('shown.bs.modal', function(e){
      self.model.keys().forEach(function(k){
        $(self.options.editModalSelector +' #' + k).val(self.model.get(k));
      });
    });


  }

});

Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ModalTableView = Backbone.View.extend({

  events: {
    'click #saveRow': 'saveRow'
  },

  initialize:function() {
    this.$el.on('show.bs.modal', function() {
      $(this).find('input, textarea, select').val('');
    });
  },

  saveRow: function(){
    // FIXME: Validations, formats, more widgets
    var rowModel = new Backbone.Model();
    this.$('input, select, textarea').each(function(k, v){
      var $v = $(v);
      if ($v.hasClass('widget-number')) {
        rowModel.set(v.id, formatter().unformatNumber($v.val()));
      } else {
        rowModel.set(v.id, $v.val() || null);
      }
    });
    this.collection.add(rowModel);
    this.$el.modal('hide');
  },

  remove: function() {
    // Don't remove $el here
    this.$el.unbind();
  }

});

Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EditModalTableView = Backbone.View.extend({

  events: {
    'click #saveRow': 'saveRow'
  },

  saveRow: function(){
    // FIXME: Validations, formats, more widgets
    var rowModel = new Backbone.Model();
    this.$('input, select, textarea').each(function(k, v){
      var $v = $(v);
      if ($v.hasClass('widget-number')) {
        rowModel.set(v.id, formatter().unformatNumber($v.val()));
      } else {
        rowModel.set(v.id, $v.val() || null);
      }
    });
    this.model.set(rowModel.toJSON());
    this.$el.modal('hide');
  },

  remove: function() {
    // Don't remove $el here
  }

});
