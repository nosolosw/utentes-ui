Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SelectBaciaView = Backbone.UILib.BaseView.extend({

  initialize: function(options) {
    Backbone.UILib.BaseView.prototype.initialize.call(this);
    var domains = options.domains;
    var bacias          = domains.byCategory('bacia');
    var subacias        = domains.byCategory('subacia');

    var selectBacias = new Backbone.UILib.SelectView({
      el: this.$('#loc_bacia'),
      collection: bacias
    });

    var selectSubacias = new Backbone.UILib.SelectView({
      el: this.$('#loc_subaci'),
      collection: [],
    });
    selectSubacias.listenTo(this.model, 'change:loc_bacia', function(model, value, options){
      this.update(subacias.where({'parent': model.get('loc_bacia')}));
    });

    this.addView(selectBacias);
    this.addView(selectSubacias);
  },

  // render. Calls parent render method

  remove: function() {
    // Take care. Call this method will remove $el from the DOM
    _.invoke(this._subviews, 'off');
    this.off();
    Backbone.UILib.BaseView.prototype.remove.call(this);
  },
});
