
var options = {mapOptions:{
  zoom:8,
}};
var map = Backbone.SIXHIARA.mapConfig('map-pane', options);

// TODO: take it from leaflet-table
var unselectedFeature = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 0.4,
  fillOpacity: 0.4
};

var geoJsonLayer = L.geoJson([],
  {
    pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng, unselectedFeature);
    },
    onEachFeature(feature, layer){
      // on adding each feat
    },
  }
).addTo(map);

var MySaveToAPI = SaveToAPI.extend({

  initialize: function() {
    this.options.toolbarIcon.tooltip = 'Gardar';
  },

  addHooks: function () {
    var polygonLayer = table.polygonLayer.toGeoJSON();
    // TODO. Probably save button should be desactivated if the validations
    // not pass
    if ((! polygonLayer ) || (polygonLayer.features.length != 1)) {
      alert ('Primeiro, você deve gerar um polígono');
      return;
    }
    feat = polygonLayer.features[0];
    code = feat.properties.name
    if (_.isEmpty(code)) {
      alert('O polígono deve ter um nome válido');
      return;
    }

    var model = new Backbone.Model({'entidade':null, 'identificador':null});

    var modalView = new Backbone.SIXHIARA.GPSModalView({
      model: model,
      selectorTmpl: '#modal-gps-tmpl'
    });
    modalView.render();

    return;
  }
});


var MyImportGPX = ImportGPX.extend({

    initialize: function(){
      this.options.toolbarIcon.tooltip = 'Abrir';
      var action = this;
      $('#input-importgpx').on('change', function(e){
        action.convertToGeoJSON(e.target.files, geoJsonLayer, map);
        // reset value of input.file element for the change event
        // to be triggered if the user loads again the same file
        $('#input-importgpx').val('');
      });
    },

    addHooks: function () {
      // make hidden input.file to open
      $('#input-importgpx').trigger('click');
    },

});

var MyMakePolygon = MakePolygon.extend({
  initialize: function() {
    this.options.toolbarIcon.tooltip = 'Críar polígono';
  }
});

var MyClear = Clear.extend({
  initialize: function() {
    this.options.toolbarIcon.tooltip = 'Eliminar seleção';
  }
});

var MyMoveToTop = MoveToTop.extend({
  initialize: function() {
    this.options.toolbarIcon.tooltip = 'Mover acima';
  }
});

var MyDeleteSelected = DeleteSelected.extend({
  initialize: function() {
    this.options.toolbarIcon.tooltip = 'Eliminar selecionados';
  }
});

var actionsToolbar = new L.Toolbar.Control({
  position: 'topright',
  actions: [MyImportGPX, MyMakePolygon, MyClear, MyMoveToTop, MyDeleteSelected, MySaveToAPI]
}).addTo(map);

var table = L.control.table(geoJsonLayer, {featOrderTitle: 'Ordem'}).addTo(map);

var exploracaos = new Backbone.SIXHIARA.ExploracaoCollection();
exploracaos.fetch();

var cultivos = new Backbone.SIXHIARA.CultivoCollection();
cultivos.fetch();

$('#settings').on('click', function(e){
  e.preventDefault();
  var configModalView = new Backbone.SIXHIARA.ConfigModalView({model: new Backbone.Model()});
  configModalView.show();
});

Backbone.SIXHIARA.offline(this.map, allLayers);
