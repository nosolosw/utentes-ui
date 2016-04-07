Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadeCultivo = Backbone.GeoJson.Feature.extend({

  defaults: {
    'id':         null,
    'cult_id': null,
    'actividade': null,
    'c_estimado': null,
    'cultivo': null,
    'rega': null,
    'eficiencia': null,
    'area': null,
    'observacio': null,
    'geometry': new Backbone.Model(),
  },

  initialize: function() {
    this.on('change:rega', this.updateEficiencia, this);
    this.on('change:area change:eficiencia', this.updateCEstimado, this);
  },

  updateEficiencia: function() {
    var eficiencia = 0;
    switch (this.get('rega')) {
      case 'Asperção':
        eficiencia = 0.76;
        break;
      case 'Goteo':
        eficiencia = 0.85;
        break;
      case 'Gravidade':
        eficiencia = 0.62;
        break;
      case 'Regional':
        eficiencia = null;
        break;
    }
    this.set('eficiencia', eficiencia);
  },

  updateCEstimado: function () {
    var tipo_rega = this.get('rega');
    var area = this.get('area');
    var eficiencia = this.get('eficiencia');
    var c_estimado = null;
    var notnull = _.every([tipo_rega, area, eficiencia], function(v) {
      return (v !== null) && (v !== undefined);
    });
    if (notnull) {
      if (tipo_rega === 'Regional') {
          c_estimado = area * 10000/12;
      } else {
          c_estimado = (area*30*86400*0.21) / (1000*eficiencia);
      }
  }
    this.set('c_estimado', c_estimado);
  },

});
