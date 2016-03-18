Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockLocationView = Backbone.View.extend({

  // TODO:
  // - modal: selects do not update model

  initialize: function (options) {
    this.subViews = [];

    var exploracao = this.model;
    this.model.on('render', this.render, this);
    options.domains.on('sync', this.renderModal, this);

    var locView = new Backbone.UILib.WidgetsView({
      el: $('#loc-info'),
      model: exploracao
    });
    this.subViews.push(locView);

  },

  render: function () {
    _.invoke(this.subViews, 'render');

    return this;
  },

  renderModal: function (collection, response, options) {
    // connect edit button
    $('#editLoc').on('click', function(e){
      e.preventDefault();
      $('#editLocModal').modal('toggle');
    });

    var exploracao = this.model;
    var domains = collection;
    var provincias  = domains.byCategory('provincia');
    var distritos   = domains.byCategory('distrito');
    var postos      = domains.byCategory('posto');
    var bacias      = domains.byCategory('bacia');
    var subacias    = domains.byCategory('subacia');

    // modal loc
    new Backbone.UILib.SelectView({
      el: $('#editLocModal #loc_provin'),
      collection: provincias
    }).render();

    var selectDistritos = new Backbone.UILib.SelectView({
      el: $('#editLocModal #loc_distri'),
      collection: []
    }).render();
    selectDistritos.listenTo(exploracao, 'change:loc_provin', function(model, value, options){
      this.update(distritos.where({'parent': model.get('loc_provin')}));
    });

    var selectPostos = new Backbone.UILib.SelectView({
      el: $('#editLocModal #loc_posto'),
      collection: []
    }).render();
    selectPostos.listenTo(exploracao, 'change:loc_distri', function(model, value, options){
      this.update(postos.where({'parent': model.get('loc_distri')}));
    });

    new Backbone.UILib.SelectView({
      el: $('#editLocModal #loc_bacia'),
      collection: bacias
    }).render();

    var selectSubacias = new Backbone.UILib.SelectView({
      el: $('#editLocModal #loc_subaci'),
      collection: [],
    }).render();
    selectSubacias.listenTo(exploracao, 'change:loc_bacia', function(model, value, options){
      this.update(subacias.where({'parent': model.get('loc_bacia')}));
    });

    new Backbone.UILib.WidgetsView({
      el: $('#editLocModal'),
      model: exploracao
    }).render();

  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subViews, 'remove');
  }

});
