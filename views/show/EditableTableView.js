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
Backbone.SIXHIARA.RowView = Backbone.View.extend({

  tagName: 'tr',

  events:{
    'click .edit': 'modelEdit',
  },

  initialize: function(options) {
    this.options = options || {};
    this.template = _.template(options.rowTemplate);
  },

  render: function(){
    this.$el.append(this.template(this.model.toJSON()));
    new Backbone.SIXHIARA.RowDeleteButtonView({
      model: this.model,
      el: this.$('.delete'),
      question: 'Tem certeza de que deseja excluir',
    });
    return this;
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
