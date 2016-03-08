Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LicenciaView = Backbone.View.extend({

  initialize: function(options){
    this.options = options || {};
    if(this.options.template){
      this.template = this.options.template;
    } else {
      throw {message: 'no template provided'};
    }
    // TODO: improve how this is done
    if(this.model.get('lic_tipo') === 'Superficial'){
      this.model.set('buttonEditLicName',  'editLicSup', {silent: true});
      this.model.set('buttonAddFonteName', 'addFonteSup', {silent: true});
    } else{
      this.model.set('buttonEditLicName',  'editLicSub', {silent: true});
      this.model.set('buttonAddFonteName', 'addFonteSub', {silent: true});
    }
  },

  render: function(){
    this.$el.html('');
    this.$el.append(this.template(this.model.toJSON()));

    return this;
  },

});
