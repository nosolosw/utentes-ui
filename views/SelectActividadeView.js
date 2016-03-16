Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SelectActividadeView = Backbone.View.extend({

  events: {
    'change': 'updateActivity'
  },

  updateActivity: function(e){
    var attr = e.target.id;
    var widget = this.$('#' + attr);
    // this would take the text of the option, not its value
    //
    // ie:
    // <select id="example">
    // <option value="1">Some text</option>
    // </select>
    //
    // model.get('example') would return "Some text", not "1"
    var widgetSelected = this.$('#' + attr + ' option:selected');
    var value = widgetSelected.text().trim() || null;
    var newActivity = null;
    if(value === 'Abastecimento'){
      newActivity = new Backbone.SIXHIARA.Actividade({
        'tipo': 'Abastecimento',
        'c_estimado': 0,
        'habitantes': 20,
        'dotacao': 0
      });
    } else if (value === 'Indústria'){
      newActivity = new Backbone.SIXHIARA.Actividade({
        'tipo': 'Indústria',
        'c_estimado': null,
        'tipo_indus': null,
        'instalacio': null,
        'efluente': null,
        'tratamento': null,
        'eval_impac': null
      });
    } else if (value === 'Piscicultura'){
      newActivity = new Backbone.SIXHIARA.Actividade({
        'tipo': 'Piscicultura',
        'c_estimado': null,
        'area': null,
        'v_reservas': null
      });
    } else if (value === 'Producção de energia'){
      newActivity = new Backbone.SIXHIARA.Actividade({
        'tipo': 'Producção de energia',
        'c_estimado': null,
        'energia_tipo': null,
        'alt_agua': null,
        'potencia': null,
        'equipo': null,
        'eval_impac': null
      });
    } else if (value === 'Saneamento'){
      newActivity = new Backbone.SIXHIARA.Actividade({
        'tipo': 'Saneamento',
        'c_estimado': null,
        'habitantes': null
      });
    }
    if(newActivity) this.model.set(attr, newActivity);
  },

});
