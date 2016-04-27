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
    var value = widgetSelected.text().trim() || Backbone.SIXHIARA.MSG.NO_ACTIVITY;
    this.model.set(attr, new Backbone.SIXHIARA.ActividadesFactory[value]());
  },

});
