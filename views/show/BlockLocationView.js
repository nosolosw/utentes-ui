Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockLocationView = Backbone.View.extend({

  events: {
      'click #editBlockLocation': 'renderModal',
  },

  initialize: function (options) {
    this.subViews = [];
    this.options = options;

    var exploracao = this.model;

    var locationView = new Backbone.UILib.WidgetsView({
      el: this.el,
      model: exploracao
    });
    this.subViews.push(locationView);

    this.domainsFilled = false;
    options.domains.on('sync', this.setDomainsFilled, this);

    exploracao.on('change', this.render, this);
  },

  setDomainsFilled: function () {
      this.domainsFilled = true;
  },

  render: function () {
    _.invoke(this.subViews, 'render');

    return this;
  },

  renderModal: function (event) {

    if(!this.domainsFilled) return;

    // add modal to DOM
    var node = $(document.body).append($('#block-location-modal-tmpl').html());

    // take it from DOM and connect components, fill selects, etc
    var modalEl = $('#editLocModal');
    var modalViews = [];

    var exploracao = this.model;
    var domains    = this.options.domains;
    var provincias = domains.byCategory('provincia');
    var distritos  = domains.byCategory('distrito');
    var postos     = domains.byCategory('posto');
    var bacias     = domains.byCategory('bacia');
    var subacias   = domains.byCategory('subacia');

    var selectProvincias = new Backbone.UILib.SelectView({
      el: $('#editLocModal #loc_provin'),
      collection: provincias
    }).render();
    modalViews.push(selectProvincias);

    var selectDistritos = new Backbone.UILib.SelectView({
      el: $('#editLocModal #loc_distri'),
      collection: []
    }).render();
    selectDistritos.listenTo(exploracao, 'change:loc_provin', function(model, value, options){
      this.update(distritos.where({'parent': model.get('loc_provin')}));
    });
    modalViews.push(selectDistritos);

    var selectPostos = new Backbone.UILib.SelectView({
      el: $('#editLocModal #loc_posto'),
      collection: []
    }).render();
    selectPostos.listenTo(exploracao, 'change:loc_distri', function(model, value, options){
      this.update(postos.where({'parent': model.get('loc_distri')}));
    });
    modalViews.push(selectPostos);

    var selectBacias = new Backbone.UILib.SelectView({
      el: $('#editLocModal #loc_bacia'),
      collection: bacias
    }).render();
    modalViews.push(selectBacias);

    var selectSubacias = new Backbone.UILib.SelectView({
      el: $('#editLocModal #loc_subaci'),
      collection: [],
    }).render();
    selectSubacias.listenTo(exploracao, 'change:loc_bacia', function(model, value, options){
      this.update(subacias.where({'parent': model.get('loc_bacia')}));
    });
    modalViews.push(selectSubacias);

    // TODO: this does not update the chained selects properly
    var widgetsView = new Backbone.UILib.WidgetsView({
      el: modalEl,
      model: exploracao
    }).render();
    modalViews.push(widgetsView);

    // remove modal from DOM on hide
    modalEl.on('hidden.bs.modal', function () {
      // this is the modal itself
      $(this).remove();
      _.invoke(modalViews, 'remove');
      modalViews = [];
    });

    // do open modal
    modalEl.modal('show');

  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subViews, 'remove');
  }

});
