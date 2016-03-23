Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SelectLocationView = Backbone.UILib.BaseView.extend({

  initialize: function(options) {
    Backbone.UILib.BaseView.prototype.initialize.call(this);
    var domains = options.domains;
    var provincias      = domains.byCategory('provincia');
    var distritos       = domains.byCategory('distrito');
    var postos          = domains.byCategory('posto');

    var selectProvincias = new Backbone.UILib.SelectView({
        el: this.$('#loc_provin'),
        collection: provincias
    });


    var selectDistritos = new Backbone.UILib.SelectView({
      el: this.$('#loc_distri'),
      collection: [],
    });
    selectDistritos.listenTo(this.model, 'change:loc_provin', function(model, value, options){
      this.update(distritos.where({'parent': model.get('loc_provin')}));
    });

    var selectPostos = new Backbone.UILib.SelectView({
      el: this.$('#loc_posto'),
      collection: [],
    });
    selectPostos.listenTo(this.model, 'change:loc_distri', function(model, value, options){
      this.update(postos.where({'parent': model.get('loc_distri')}));
    });

    this.addView(selectProvincias);
    this.addView(selectDistritos);
    this.addView(selectPostos);
  },

  // render. Calls parent render method

  remove: function() {
    // Take care. Call this method will remove $el from the DOM
    _.invoke(this._subviews, 'off');
    this.off();
    Backbone.UILib.BaseView.prototype.remove.call(this);
  },
});
