Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SummaryLicenciaView = Backbone.View.extend({

  render: function(){
    var valid = false;
    this.model.get('licencias').forEach(function(licencia){
      valid = (licencia.get('estado') === 'Licenciada');
    });

    if(valid){
      this.$el.removeClass('label-danger').addClass('label-success');
    } else{
      this.$el.removeClass('label-success').addClass('label-danger');
    }
  }

});
