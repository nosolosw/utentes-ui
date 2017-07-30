Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadePiscicultura = Backbone.SIXHIARA.ActividadeNull.extend({

  defaults: {
    'id':         null,
    'tipo':       'Piscicultura',
    'c_estimado': null,
    'area':       null,
    'ano_i_ati': null,
    'n_tanques': null,
    'v_reservas': null,
    'n_ale_pov': null,
    'produc_pi': null,
    'tipo_proc': null,
    'asis_aber': null,
    'asis_moni': null,
    'asis_orig': null,
    'asis_or_o': null,
    'trat_t_en': null,
    'trat_a_sa': null,
    'gaio_subm': null,
    'problemas': null,
    'prob_prin': null,
    'tanques_piscicolas': new Backbone.SIXHIARA.TanquePiscicolaCollection(),
  },

  initialize: function () {
    this.listenTo(this.get("tanques_piscicolas"), 'add', this.onAddedTanquePiscicola);
    this.listenTo(this.get("tanques_piscicolas"), 'remove', this.onRemovedTanquePiscicola);
  },

  onAddedTanquePiscicola: function() {
    this.trigger("tanque_added");
  },

  onRemovedTanquePiscicola: function() {
    this.trigger("tanque_removed");
  },

  parse: function(response) {
      response.tanques_piscicolas = new Backbone.SIXHIARA.TanquePiscicolaCollection(response.tanques_piscicolas, {parse: true});
      return response;
  },

  toJSON: function () {
    var json      =  _.clone(this.attributes);
    json.tanques_piscicolas = this.get('tanques_piscicolas').toJSON();
    return json;
  },

  getActividadeLayer: function(map) {
    var tanques_piscicolas = this.get('tanques_piscicolas');
    if (! tanques_piscicolas) return null;
    var geojson = tanques_piscicolas.toGeoJSON();
    if (geojson.features.length == 0) return null;
    return L.geoJson(geojson, {
     onEachFeature: function(feature, layer) {
       var label = L.marker(layer.getBounds().getCenter(), {
         icon: L.divIcon({
           className: 'label',
           html: feature.properties.tanque_id,
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
   this.get('tanques_piscicolas').forEach(function(tanque){
     var msgs = tanque.validate();
     if (msgs) {
       messages = messages.concat(msgs);
     }
   });
   return messages;
 },

});

// declare activity for dinamic discovery
Backbone.SIXHIARA.ActividadesFactory = Backbone.SIXHIARA.ActividadesFactory || {};
Backbone.SIXHIARA.ActividadesFactory['Piscicultura'] = Backbone.SIXHIARA.ActividadePiscicultura;
