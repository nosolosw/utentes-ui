SIXHIARA.Views.MapView = Backbone.View.extend({

  initialize: function(){
    var base = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    var exploracaoGeo1 = {
      "type": "Feature",
      "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [38.4563, -13.2907],
          [38.5908, -13.2720],
          [38.5496, -13.3575],
          [38.3464, -13.4403]
        ]]
      }
    };

    var exploracaoGeo2 = {
      "type": "Feature",
      "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [40.5581, -12.9718],
          [40.5792, -12.9779],
          [40.5629, -12.9927],
        ]]
      }
    };

    var exploracaoGeo3 = {
      "type": "Feature",
      "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [39.6079, -13.4104],
          [39.7150, -13.3583],
          [39.7109, -13.4945],
        ]]
      }
    };

    var exploracao1 = L.geoJson(exploracaoGeo1);
    var exploracao2 = L.geoJson(exploracaoGeo2);
    var exploracao3 = L.geoJson(exploracaoGeo3);

    var map = L.map('map', {
      center: [-13, 39.25],
      zoom: 8,
      layers: [base, exploracao1, exploracao2, exploracao3]
    });

  }
});
