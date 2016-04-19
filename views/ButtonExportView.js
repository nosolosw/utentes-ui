function Workbook() {
   if(!(this instanceof Workbook)) return new Workbook();
   this.SheetNames = [];
   this.Sheets = {};
};

Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonExportView = Backbone.View.extend({
  /* http://sheetjs.com/demos/Export2Excel.js */

  events: {
    "click #export-button": "export",
    // "change #fileinput": "export",
  },

  initialize: function(options) {
    this.options = options || {};
  },

  render: function() {
    this.$el.append($('<button id="export-button" type="button" class="btn btn-default btn-sm pull-right">Exportação</button>'));
    // var html = `<form>
    //     <input id="fileinput" type="file" style="display:none;"/>
    //   </form>
    //   <button id="export-button" type="button" class="btn btn-default btn-sm pull-right">Exportação</button>`
    //   // this.$el.append($('<input type="file" id="export-button" name=files[] class="btn btn-default btn-sm pull-right">Exportação</input>'));
    //   this.$el.append($(html));
  },

  // doClick: function() {
  //    $("#fileinput").click();
  // },

  export: function(evt){

    var exploracaos = this.options.listView.collection.sortBy(function(exp){
      return exp.get('utente').get('nome');
    });

    var data = exploracaos.map(function(exp){
      var utente = exp.get('utente');
      return [
        utente.get('nome'),
        utente.get('nuit'),
        utente.get('entidade'),
        utente.get('reg_comerc'),
        utente.get('reg_zona'),
        utente.get('loc_provin'),
        utente.get('loc_distri'),
        utente.get('loc_posto'),
        utente.get('loc_nucleo'),
        utente.get('observacio'),
        exp.get('exp_id'),
        exp.get('exp_name'),
        exp.getActividadeTipo(),
        exp.get('c_licencia'),
        exp.get('c_soli'),
        exp.get('c_real'),
        exp.get('c_estimado'),
      ]
    });

    var wb = new Workbook();
    var ws = this.sheet_from_array_of_arrays(data);

    /* add ranges to worksheet */
    /* ws['!merges'] = ranges; */

    /* add worksheet to workbook */
    var ws_name = "Explorações";
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});
    saveAs(new Blob([this.s2ab(wbout)],{type:"application/octet-stream"}), "exploracoes.xlsx")

  },

  sheet_from_array_of_arrays: function(data, opts) {
  	var ws = {};
  	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
  	for(var R = 0; R != data.length; ++R) {
  		for(var C = 0; C != data[R].length; ++C) {
  			if(range.s.r > R) range.s.r = R;
  			if(range.s.c > C) range.s.c = C;
  			if(range.e.r < R) range.e.r = R;
  			if(range.e.c < C) range.e.c = C;
  			var cell = {v: data[R][C] };
  			if(cell.v == null) continue;
  			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

  			if(typeof cell.v === 'number') cell.t = 'n';
  			else if(typeof cell.v === 'boolean') cell.t = 'b';
  			else if(cell.v instanceof Date) {
  				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
  				cell.v = this.datenum(cell.v);
  			}
  			else cell.t = 's';

  			ws[cell_ref] = cell;
  		}
  	}
  	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  	return ws;
  },

  datenum: function(v, date1904) {
  	if(date1904) v+=1462;
  	var epoch = Date.parse(v);
  	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
  },

  s2ab: function(s) {
    var buf = new ArrayBuffer(s.length);
	  var view = new Uint8Array(buf);
	  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	  return buf;
  },


});
