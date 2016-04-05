Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.OpenFolderButtonView = Backbone.View.extend({

  events: {
    "click": "doClick"
  },

  doClick: function(){

    var docPath = Backbone.SIXHIARA.Config.docPath;
    nodeRequire('shell').showItemInFolder(docPath);
  }

});
