Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockMapView = Backbone.View.extend({

  initialize: function(){

    var base = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    var map = L.map('map', {
      center: [-13.3030, 38.5050],
      zoom: 7,
      layers: [base]//, exploracaoLeaflet]//, cultivos]
    });

    var geom = this.model.get('geometry').toJSON();
    if (_.has(geom, 'coordinates') && _.has(geom, 'type')){
      var exploracaoGeoJSON = {
        "type": "Feature",
        "properties": {},
        "geometry": geom
      };
      // TODO: cultivos
      // var cultivosGeoJSON = {
      //   "type": "Feature",
      //   "properties": {
      //     "name": "Coors Field",
      //     "amenity": "Baseball Stadium",
      //     "popupContent": "This is where the Rockies play!"
      //   },
      //   "geometry": {
      //     "type": "Polygon",
      //     // "coordinates": [38.5050, -13.3030]
      //     "coordinates": [[
      //       [38.4700, -13.3000],
      //       [38.4496, -13.3575],
      //       [38.4302, -13.3503]
      //     ]]
      //   }
      // };

      var exploracaoLeaflet = L.geoJson(exploracaoGeoJSON).addTo(map);
      // var cultivos = L.geoJson(cultivosGeoJSON);
      map.fitBounds(exploracaoLeaflet.getBounds()).setMaxBounds(exploracaoLeaflet.getBounds());

      // var baseMaps = {};
      // var overlayMaps = {
      //   'Exploração': exploracaoLeaflet,
      //   // 'Cultivos': cultivos
      // };
      // L.control.layers(baseMaps, overlayMaps).addTo(map);

      // var drawnItems = new L.GeoJSON();
      // var drawControl = new L.Control.Draw({
      //   draw: {
      //     circle: false,
      //     rectangle: false,
      //     marker: false,
      //     polyline: false
      //   },
      //   edit: {
      //     featureGroup: exploracaoLeaflet
      //   }
      // });
      // map.addControl(drawControl);

      // map.on('draw:start', function (e) {
      //   var type = e.layerType,
      //   layer = e.layer;
      //
      //   if (type === 'marker') {
      //     // Do marker specific actions
      //   }

        // Do whatever else you need to. (save to db, add to map etc)
        // exploracao.addData(drawnItems);
      // });
    }


  }

});
