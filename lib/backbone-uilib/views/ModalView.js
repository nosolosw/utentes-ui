Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.ModalView = Backbone.View.extend({

  events: {
    'click #okButton': 'okButtonClicked'
  },

  initialize: function (options) {
    this.options = options || {};
    this.auxViews = [];

    if(!this.options.selectorTmpl) throw "You need to provide a selector template";

    // take the template and append it to DOM
    var selectorTmpl = this.options.selectorTmpl;
    this.template = _.template($(selectorTmpl).html());
    this.$el.html(this.template(this.model.toJSON()));
    $(document.body).append(this.el);

    // connect events:
    // - modal and aux views would be removed from DOM on close
    var self = this;
    this.$('.modal').on('hidden.bs.modal', function () {
      // this is the modal itself
      $(this).remove();
      self.remove();
    });

  },

  addAuxView: function (view) {
    this.auxViews.push(view);
    return view;
  },

  render: function () {
    this.draftModel = this.model.clone();
    var widgetsView = new Backbone.UILib.WidgetsView({
      el: this.$el,
      model: this.draftModel,
    }).render();
    this.addAuxView(widgetsView);

    this.$('.modal').modal('show');
  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _.invoke(this.auxViews, 'remove');
    this.auxViews = [];
  },

  okButtonClicked: function () {
    this.model.set(this.draftModel.toJSON());
    this.$('.modal').modal('hide');
  },

});
