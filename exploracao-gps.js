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
    console.log('save to API');
  }
});

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
