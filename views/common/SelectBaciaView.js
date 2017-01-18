Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SelectBaciaView = Backbone.UILib.BaseView.extend({

  initialize: function(options) {
    Backbone.UILib.BaseView.prototype.initialize.call(this);

    var domains = options.domains;
    var ara = domains.byCategory('ara').first().get('text')
    var bacias = domains.byCategory('bacia').byParent(ara);
    var subacias = domains.byCategory('subacia');

    var selectBacias = new Backbone.UILib.SelectView({
      el: this.$('#loc_bacia'),
      collection: bacias
    });
    this.addView(selectBacias);

    var selectSubacias = new Backbone.UILib.SelectView({
      el: this.$('#loc_subaci'),
      collection: subacias.byParent(this.model.get('loc_bacia')),
    });
    selectSubacias.listenTo(this.model, 'change:loc_bacia', function(model, value, options){
      this.update(subacias.where({'parent': model.get('loc_bacia')}));
    });
    this.addView(selectSubacias);

  },

  // render - Backbone.UILib.BaseView.prototype.render.call(this);

  // remove - Backbone.UILib.BaseView.prototype.remove.call(this);

});
