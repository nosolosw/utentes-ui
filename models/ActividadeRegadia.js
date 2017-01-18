Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadeRegadia = Backbone.SIXHIARA.ActividadeNull.extend({

  defaults: {
    'id':         null,
    'tipo':       'Agricultura de Regadio',
    'c_estimado': null,
    'cultivos':   new Backbone.SIXHIARA.CultivoCollection(),
  },

  initialize: function () {
    // on add, remove & update every cultivo
    this.get('cultivos').on('all', this.updateCEstimado, this);
  },

  parse: function(response) {
      response.cultivos = new Backbone.SIXHIARA.CultivoCollection(response.cultivos, {parse: true});
      return response;
  },

  updateCEstimado: function () {
    var c_estimado = 0;
    this.get('cultivos').forEach(function(cultivo){
      c_estimado = c_estimado + cultivo.get('c_estimado');
    });
    this.set('c_estimado', c_estimado);
    this.trigger('change', this.model);
  },

  toJSON: function () {
    var json      =  _.clone(this.attributes);
    json.cultivos = this.get('cultivos').toJSON();
    return json;
  },

  getActividadeLayer: function(map) {
    var cultivos = this.get('cultivos');
    if (! cultivos) return null;
    var geojson = cultivos.toGeoJSON();
    if (geojson.features.length == 0) return null;
    return L.geoJson(geojson, {
     onEachFeature: function(feature, layer) {
       var label = L.marker(layer.getBounds().getCenter(), {
         icon: L.divIcon({
           className: 'label',
           html: feature.properties.cult_id,
           iconSize: [100, 40]
         })
       }).addTo(map);
     },
     style: {
       stroke: true,
       color: '#00b300',
       weight: 1,
       opacity: 1,
       fillColor: '#00b300',
       fillOpacity: 0.5,
     }
   });
 },

 validateSubActivity: function() {
   var messages = [];
   this.get('cultivos').forEach(function(cultivo){
     var msgs = cultivo.validate();
     if (msgs) {
       messages = messages.concat(msgs);
     }
   });
   return messages;
 },

});

// declare activity for dinamic discovery
Backbone.SIXHIARA.ActividadesFactory = Backbone.SIXHIARA.ActividadesFactory || {};
Backbone.SIXHIARA.ActividadesFactory['Agricultura de Regadio'] = Backbone.SIXHIARA.ActividadeRegadia;
