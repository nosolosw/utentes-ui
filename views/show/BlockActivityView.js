Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockActivityView = Backbone.View.extend({

  initialize: function (options) {
    this.subViews = [];

    var actividadeView = new Backbone.SIXHIARA.ActividadeView({
      el: $('#info-actividade'),
      model: this.model,
      template: _.template($("[id='" + this.model.get('actividade').get('tipo') + "']").html())
    });
    actividadeView.listenTo(this.model, 'change:actividade', function(model, value, options){
      this.template = _.template($("[id='" + model.get('actividade').get('tipo') + "']").html())
      this.render();
    });
    this.subViews.push(actividadeView);

    options.domains.on('sync', this.renderModal, this);

  },

  render: function () {
    _.invoke(this.subViews, 'render');

    return this;
  },

  renderModal: function (collection, response, options) {

    $('#editActividade').on('click', function(e){
      e.preventDefault();
      $('#editActividadeModal').modal('toggle');
    });

    var actividades = collection.byCategory('actividade');
    new Backbone.UILib.SelectView({
      el: $('#editActividadeModal #actividade'),
      collection: actividades
    }).render();

    // make the magic happen
    new Backbone.SIXHIARA.SelectActividadeView({
      el: $('#actividade-explotacion'),
      model: this.model
    });

  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subViews, 'remove');
  },

});
