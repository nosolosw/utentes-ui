Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockActivityView = Backbone.View.extend({

  initialize: function (options) {
    this.options = options || {};
    this.subViews = [];

    var actividadeView = new Backbone.SIXHIARA.ActividadeView({
      el: this.el,
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

    var self = this;
    $('#editActividade').on('click', function(e){
      e.preventDefault();
      $('#editActividadeModal').modal('toggle');
    });
    $('#editActividadeModal').on('shown.bs.modal', function(e){
      $('#editActividadeModal #info-actividade').append($('<div class="actividade-render">'));
      var template = _.template($("[id='" + self.model.get('actividade').get('tipo') + "_edit']").html())
      $('#editActividadeModal .actividade-render').html('');
      $('#editActividadeModal .actividade-render').append(template(self.model.get('actividade').toJSON()));
      new Backbone.UILib.SelectView({
        el: $('#editActividadeModal #tipo_indus'),
        collection: self.options.domains.byCategory('industria_tipo')
      }).render();
      new Backbone.UILib.SelectView({
        el: $('#editActividadeModal #energia_tipo'),
        collection: self.options.domains.byCategory('energia_tipo')
      }).render();

      self.listenToOnce(self.model, 'change:actividade', function(model, value, options){
        self.doToggle = true;
        $('#editActividadeModal').modal('hide');
      });
    });

    $('#editActividadeModal').on('hidden.bs.modal', function(){
        $(this).find('input, textarea, select').val('');
        $('#editActividadeModal .actividade-render').remove();
        if (self.doToggle) {
            self.doToggle = false;
            $('#editActividadeModal').modal('show');
        }
    });

    $('#editActividadeModal').on('hide.bs.modal', function(){
        if (self.doToggle) return;
        if (!self.model.get('actividade')) return;
        $('#editActividadeModal .actividade-render').find('input, select, textarea').each(function(k, v){
          var $v = $(v);
          if ($v.hasClass('widget-number')) {
            self.model.get('actividade').set(v.id, formatter().unformatNumber($v.val()));
          } else {
            self.model.get('actividade').set(v.id, $v.val() || null);
          }
        });
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
