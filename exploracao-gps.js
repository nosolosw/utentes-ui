var map = L.map('map-pane').setView([-12.965, 40.508], 16);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// TODO: take it from leaflet-table
var unselectedFeature = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: .4,
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

    // $('#show-modal').click(function() {
        var view = new Backbone.SIXHIARA.GPSModalView({ model: model });
        view.show();
        return;
    // });

    e = exploracaos.filter({'exp_id':code});
    if (e.length != 1) {
      alert('O arquivo de código não existe');
      return;
    }



    saveModelToAPI(e[0], feat.geometry)
  }
});

var saveModelToAPI = function(model, geometry) {
  model.get('geometry').set('type', geometry.type);
  model.get('geometry').set('coordinates', geometry.coordinates);
  model.set('geometry_edited', true);
  if(! model.isValid()) {
    alert(model.validationError);
    return;
  }

  model.save(null, {
    wait: true,
    success: function(model, resp, options) {
      table.deleteSelected();
      table.clear();
    },
    error: function(xhr, textStatus, errorThrown) {
      alert(textStatus.statusText + ' ' + textStatus.responseText);
    }
  });
}

var MyImportGPX = ImportGPX.extend({

    initialize: function(){
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

var actionsToolbar = new L.Toolbar.Control({
  position: 'topright',
  actions: [MyImportGPX, MakePolygon, Clear, MoveToTop, DeleteSelected, MySaveToAPI]
}).addTo(map);

var table = L.control.table(geoJsonLayer).addTo(map);

var exploracaos = new Backbone.SIXHIARA.ExploracaoCollection();
exploracaos.fetch();

var cultivos = new Backbone.SIXHIARA.CultivoCollection();
cultivos.fetch();
