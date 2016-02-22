L.Control.Table = L.Control.extend({
  options: {
    position:      'topright',
    featIdProp:    'fid', // be sure it doesn't conflict with a GeoJSON property
    featCodeProp:  'name',
    featCodeTitle: 'Código',
    unselectedFeature: {
      radius:      8,
      fillColor:   "#ff7800",
      color:       "#000",
      weight:      1,
      opacity:      .4,
      fillOpacity: 0.4
    },
    selectedFeature: {
      radius:      8,
      fillColor:   "#F00",
      color:       "#000",
      weight:      1,
      opacity:     1,
      fillOpacity: 0.8
    }
  },

  initialize: function(geoJsonLayer, options) {
    this.geoJsonLayer = geoJsonLayer;
    this.selection = new Map();
    L.Util.setOptions(this, options);

    var unselect = this.options.unselectedFeature;
    this.polygonLayer = L.geoJson([],
      {
        pointToLayer: function(feature, latlng){
          return L.circleMarker(latlng, unselect);
        },
        onEachFeature(feature, layer){
          // on adding each feat
        },
      }
    ).addTo(map);
  },

  onAdd: function(map){
    var title = this.options.featCodeTitle;

    // create table container
    var container = L.DomUtil.create('div', 'table-container');
    var table = this.table = L.DomUtil.create('table', 'scrollable', container);
    table.innerHTML += '<thead><tr><th><strong>' + title + '</strong></th></tr></thead>';
    var tbody = this.tbody = L.DomUtil.create('tbody', '', table);
    // fill table with rows, if geoJsonLayer group has any layer
    var control = this;
    this.geoJsonLayer.eachLayer(function(layer){
      control.doAddRow(table, layer);
    });
    L.DomUtil.setOpacity(this.table, .7);

    // set events
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.addListener(this.table, 'click', this.selectByRow, this);
    L.DomEvent.addListener(this.table, 'dblclick', this.editByRow, this);
    this.geoJsonLayer.on('click', this.selectByFeature, this);
    // this.geoJsonLayer.on('dblclick', this.editByFeature, this);
    this.geoJsonLayer.on('layeradd', this.addRow, this);
    this.geoJsonLayer.on('layerremove', this.removeRow, this);

    return container;
  },

  onRemove: function(map){
    // unset events
    L.DomEvent.removeListener(this.table, 'click', this.selectRow, this);
    L.DomEvent.removeListener(this.table, 'dblclick', this.editRow, this);
    this.geoJsonLayer.off('click', this.selectByFeature, this);
    // this.geoJsonLayer.off('dblclick', this.editByFeature, this);
    this.geoJsonLayer.off('layeradd', this.addRow, this);
    this.geoJsonLayer.off('layerremove', this.removeRow, this);
  },

  deleteSelected: function(){
    this.selection.forEach(function(value, key, map){
      this.geoJsonLayer.removeLayer(value.properties[this.options.featIdProp]);
    }, this);
    this.selection.clear();
  },

  moveToTop: function(){
    // TODO: keep sorting strategy for selected rows
    var firstTR = this.tbody.firstChild;
    var tbody = this.tbody;
    this.selection.forEach(function(value, key){
      var rowToMove = L.DomUtil.get('fid-' + key).parentNode;
      tbody.insertBefore(rowToMove, firstTR);
    });
  },

  clear: function(){
    // clear selection
    var control = this;
    this.selection.forEach(function(value, key){
      control.unstyleRow(key);
      control.unstyleFeature(key); // this would delete selection id
    });
    // clear new polygon layer
    this.polygonLayer.clearLayers();
  },

  selectByRow: function(e){
    if(e.target.id === (undefined || '')){
      // it is not a cell or has no fid defined
      return;
    }
    // id equals to 'fid-123'
    var fid = parseInt(e.target.id.split('-')[1]);
    if(L.DomUtil.hasClass(e.target, 'selected')){
      L.DomUtil.removeClass(e.target, 'selected');
      this.unstyleFeature(fid);
    } else{
      L.DomUtil.addClass(e.target, 'selected');
      this.styleFeature(fid);
    }
  },

  selectByFeature: function(e){
    var fidProp = this.options.featIdProp;
    var fid = e.layer.feature.properties[fidProp];

    var unselect = this.options.unselectedFeature;
    var select = this.options.selectedFeature;
    if(e.layer.options.fillColor === select.fillColor){ // it is selected
      e.layer.setStyle(unselect);
      this.unstyleRow(fid);
      this.selection.delete(fid);
    } else { // it is not selected
      e.layer.setStyle(select);
      this.styleRow(fid);
      this.selection.set(fid, e.layer.feature);
    }
  },

  styleFeature: function(fid){
    var fidProp = this.options.featIdProp;
    var selection = this.selection;
    var select = this.options.selectedFeature;
    this.geoJsonLayer.eachLayer(function(layer){
      if(fid === layer.feature.properties[fidProp]){
        layer.setStyle(select);
        selection.set(fid, layer.feature);
      }
    });
  },

  unstyleFeature: function(fid){
    var fidProp = this.options.featIdProp;
    var selection = this.selection;
    var control = this;
    var unselect = this.options.unselectedFeature;
    this.geoJsonLayer.eachLayer(function(layer){
      if(fid === layer.feature.properties[fidProp]){
        layer.setStyle(unselect);
        selection.delete(fid);
      }
    });
  },

  styleRow: function(fid){
    var target = L.DomUtil.get('fid-' + fid);
    L.DomUtil.addClass(target, 'selected');
  },

  unstyleRow: function(fid){
    var target = L.DomUtil.get('fid-' + fid);
    L.DomUtil.removeClass(target, 'selected');
  },

  addRow: function(e){
    this.doAddRow(this.table, e.layer);
  },

  doAddRow: function(table, layer){
    var fid = this.options.featIdProp,
    code = this.options.featCodeProp;

    // add id
    var props = layer.feature.properties;
    props[fid] = layer._leaflet_id;

    // add row
    var newRow = this.tbody.insertRow();
    var newCell = newRow.insertCell();
    newCell.setAttribute('id', 'fid-' + props[fid]);
    newCell.appendChild(document.createTextNode(props[code]));
  },

  removeRow: function(e){
    var td = L.DomUtil.get('fid-' + e.layer._leaflet_id);
    this.table.deleteRow(td.parentNode.rowIndex);
  },

  editByRow: function(e){
    if(e.target.id === (undefined || '')) {
      // it is not a cell or has no fid defined
      return;
    }

    // don't let two popups to be opened simultaneously
    if(L.DomUtil.get('editPopup')){
      this.closePopup();
    }

    var cellId = e.target.id;

    var panel = "<div id='editPopup' style='left: -10px; min-width: 50px;' class='edit_text_dialog'><div class='content'><div><div class='field string'>" +
    "<textarea id='textAreaEditPopup' style='min-width: 54px;' class='string_field dy'>" + e.target.textContent + "</textarea></div></div></div>" +
    "<div class='foot'>" +
    "<a id='cancelEditPopup' class='left'>Cancelar</a>" +
    "<a id='saveEditPopup' class='right'>Guardar</a>" +
    "</div>" +
    "</div>";

    e.target.innerHTML = panel + e.target.innerHTML;
    document.getElementById('textAreaEditPopup').select();

    var control = this;
    document.getElementById('textAreaEditPopup').addEventListener('keypress', function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode == '13'){ // ENTER key was pressed
        control.savePropertyAndClosePopup(cellId);
      }
    });

    document.getElementById("saveEditPopup").addEventListener("click", function( event ) {
      control.savePropertyAndClosePopup(cellId);
    }, false);

    document.getElementById("cancelEditPopup").addEventListener("click", function( event ) {
      control.closePopup();
    }, false);

  },

  closePopup: function(){
    L.DomUtil.get('editPopup').remove();
  },

  savePropertyAndClosePopup: function(cellId){
    var fidProp = this.options.featIdProp;
    var codeProp = this.options.featCodeProp;
    var popup = L.DomUtil.get('editPopup');
    var newValue = L.DomUtil.get('textAreaEditPopup').value;

    var fid = parseInt(cellId.split('-')[1]);

    // edit table row value
    var cell = L.DomUtil.get(cellId);
    cell.textContent = newValue;

    // edit layer property value
    this.geoJsonLayer.eachLayer(function(layer){
      if(fid === layer.feature.properties[fidProp]){
        layer.feature.properties[codeProp] = newValue;
      }
    });

    // remove popup
    popup.remove();
  },

  makePolygon: function(){
    this.polygonLayer.clearLayers();
    this.polygonLayer.addData(this.getPolygonFromPoints());
    return this.polygonLayer;
  },

  saveToAPI: function(){
    // TODO: save polygon
    // this could be a extensible point for others to choose what to do
    this.deleteSelected();
  },

  getPolygonFromPoints: function(){
    // TODO: allow multipolygons and points
    var polygon = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[]]
      }
    };

    var myarray = [];
    this.selection.forEach(function(value, key){
      myarray.push(value);
    });

    if (myarray.length < 3) return polygon;

    var code = this.options.featCodeProp;
    myarray.sort(function(a, b){
      if(a.properties[code] < b.properties[code]){
        return -1;
      } else if (a.properties[code] > b.properties[code]){
        return 1;
      }
      return 0;
    });

    var fidProp = this.options.featIdProp;
    var codeProp = this.options.featCodeProp;
    myarray.forEach(function(feat){
      // this assumes one polygon
      polygon.geometry.coordinates[0].push([
        feat.geometry.coordinates[0],
        feat.geometry.coordinates[1]
      ]);
      // TODO: save proper code property
      // now it takes properties from last point
      polygon.properties[codeProp] = feat.properties[codeProp];
      polygon.properties[fidProp] = feat.properties[fidProp];
    });
    return polygon;
  },

});

L.control.table = function(geoJsonLayer, options){
  return new L.Control.Table(geoJsonLayer, options);
}
