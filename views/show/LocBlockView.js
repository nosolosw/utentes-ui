Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LocBlockView = Backbone.View.extend({

  initialize: function () {
    this.subViews = [];

    var exploracao = this.model;
    exploracao.on('render', function () {
      this.render();
    }, this);

    // block loc-info & its modal
    var locView = new Backbone.UILib.WidgetsView({
      el: $('#loc-info'),
      model: exploracao
    });
    this.subViews.push(locView);

    $('#editLoc').on('click', function(e){
      e.preventDefault();
      $('#editLocModal').modal('toggle');
    });
  },

  render: function () {
    _.invoke(this.subviews, 'render');

    return this;
  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.subviews, 'remove');
  }

});
