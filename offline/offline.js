Backbone.SIXHIARA.offline = function(map, layersConfig){

  // TODO. The inital load newLayers2, and the two call to restackLayers should
  // be improved

  var restackLayers = function (newLayers) {
    if (newLayers.length > 0) {
      var lowestLayer = null;
      var pos;
      var layer;

      for (var i = 0, len = newLayers.length; i < len; i++) {
        pos = getLayerPosition(newLayers[i]);
        if ((lowestLayer == null) || (lowestLayer < pos)) {
          lowestLayer = pos;
        }
      }

      if (lowestLayer != null) {
        for (var i = lowestLayer; i >= 0; i--) {
          layer = layerOrder[i];
          if (newLayers.indexOf(layer) != -1) {
            feature_group.addLayer(layer);
          } else if (map.hasLayer(layer)) {
            layer.bringToFront();
          }
        }
      }
    }
    feature_group.bringToBack();
  };

  var getLayerPosition = function (layer) {
    for (index = 0, len = layerOrder.length; index < len; index++) {
      if (layerOrder[index] == layer) {
        return index;
      }
    }
    return null;
  }

  var layerOrder = [];
  var feature_group = new L.featureGroup([]).addTo(map);
  var newLayers2 = [];
  for (layerConfig in layersConfig) {
    var helper = layersConfig[layerConfig];
    if (helper['scaleDependent']) {
      // Commonly closeZoom = 18, farZoom = 1
      helper['scaleDependent'].farZoom = helper['scaleDependent']['farZoom'] || -1;
      helper['scaleDependent'].closeZoom = helper['scaleDependent']['closeZoom'] || Number.MAX_VALUE;
    }
    layerOrder[helper.initialOrder] = helper.layer;
    newLayers2.push(helper.layer);
  }

  var layerCounter = newLayers2.length;
  var addLayerData = function(url, helper) {
    (function() {
      $.getJSON(url, function(data) {
        helper.layer.clearLayers();
        helper.layer.addData(data);
        layerCounter -= 1;
        if (layerCounter === 0) {
          restackLayers(getVisibleLayers(true));
          feature_group.showLabel();
        }
      });
    }());
  }


  for (layerConfig in layersConfig) {
    var url = '/static/utentes-ui/offline/data/' + layerConfig + '.js';
    addLayerData(url, layersConfig[layerConfig]);
  }

  var self = this;
  map.on('zoomend', function(e) {
    var newLayers = getVisibleLayers();
    restackLayers(newLayers);
  });

  var getVisibleLayers = function(reAddLayers) {
    var newLayers = [];
    var zoom = map.getZoom();
    // TODO. Uses scales instead of zoom
    // console.log(map.getScaleZoom());
    for (layerConfig in layersConfig) {
      var helper = layersConfig[layerConfig];
      var scaleDependent = helper['scaleDependent'];
      if (scaleDependent) {
        if ((scaleDependent.farZoom <= zoom) && (zoom <= scaleDependent.closeZoom)) {
          newLayers.push(helper.layer)
        } else {
          feature_group.removeLayer(helper.layer);
        }
      } else if (reAddLayers){
        newLayers.push(helper.layer);
      }
    }
    return newLayers;
  }

}
