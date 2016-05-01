Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LayerConfig = {
  json_Albufeiras:{
    layer: L.geoJson(null, {style:Backbone.SIXHIARA.LayerStyle.doStyleAlbufeiras}),
    initialOrder: 7,
    scaleDependent: {
      farZoom: 11, // 500.000
    }
  },
  json_CidadesVilas:{
    layer: L.geoJson(null, {pointToLayer: Backbone.SIXHIARA.LayerStyle.doPointToLayerCidadesVilas}),
    initialOrder: 6,
  },
  json_Estradas:{
    layer: L.geoJson(null, {style:Backbone.SIXHIARA.LayerStyle.doStyleEstradas}),
    initialOrder: 5,
    scaleDependent: {
      // http://wiki.openstreetmap.org/wiki/Zoom_levels
      farZoom: 11, // 500.000
    }
  },
  json_Lagos:{
    layer: L.geoJson(null, {style:Backbone.SIXHIARA.LayerStyle.doStyleLagos}),
    initialOrder: 4,
  },
  json_Oceano:{
    layer: L.geoJson(null, {style:Backbone.SIXHIARA.LayerStyle.doStyleOceano}),
    initialOrder: 0,
  },
  json_Pais:{
    layer: L.geoJson(null, {style:Backbone.SIXHIARA.LayerStyle.doStylePais}),
    initialOrder: 1,
  },
  json_Postos:{
    layer: L.geoJson(null, {
      style:Backbone.SIXHIARA.LayerStyle.doStylePostos,
      // onEachFeature: Backbone.SIXHIARA.LayerStyle.onEachFeaturePostos,
    }),
    initialOrder: 2,
  },
  json_Provincias:{
    layer: L.geoJson(null, {
      style:Backbone.SIXHIARA.LayerStyle.doStyleProvincias,
      // onEachFeature: Backbone.SIXHIARA.LayerStyle.onEachFeatureProvincias,
    }),
    initialOrder: 3,
  },
  json_Rios:{
    layer: L.geoJson(null, {style:Backbone.SIXHIARA.LayerStyle.doStyleRios}),
    initialOrder: 8,
    scaleDependent: {
      farZoom: 11, // 500.000
    }
  },
  json_PaisesPunto:{
    layer: L.geoJson(null, {pointToLayer: Backbone.SIXHIARA.LayerStyle.doPointToLayerPaisesPunto}),
    initialOrder: 9,
  },
  json_PostosPunto:{
    layer: L.geoJson(null, {pointToLayer: Backbone.SIXHIARA.LayerStyle.doPointToLayerPostosPunto}),
    initialOrder: 10,
    scaleDependent: {
      farZoom: 9, // 1.000.000
    }
  },
  json_ProvinciasPunto:{
    layer: L.geoJson(null, {pointToLayer: Backbone.SIXHIARA.LayerStyle.doPointToLayerProvinciasPunto}),
    initialOrder: 11,
  },
};
