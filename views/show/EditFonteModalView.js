Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EditFonteModalView = Backbone.View.extend({

  initialize: function (options) {
    options.domains.on('sync', this.fillSelect, this);

    this.template = $('#edit-fonte-modal-tmpl').html();
  },

  render: function(){

    // https://github.com/twbs/bootstrap/issues/17732
    // Bootstrap adds the modal to the DOM every time modal('toggle') is called
    // but on close, only hides the window, do not remove it from the DOM.
    // That creates "zombie modals" that are responding to past events, which
    // may have unintended consequences.
    //
    // So, we better append it to the DOM ourselves and remove it on hide.
    var node = $(document.body).append(this.template);

    this.bindEvents();

    $('#editFonteModal').modal('show');
  },

  bindEvents: function () {

    var fonte = this.model;

    // - on hide
    $('#editFonteModal').on('hidden.bs.modal', function () {
      // this is the modal itself
      $(this).remove();
    });

    // - on click updateButton
    $('#editFonteModal #updateFonte').on('click', function(event){
      // this is the modal itself
      $('#editFonteModal').modal('hide');
      fonte.set('c_soli', formatter().unformatNumber($('#editFonteModal #c_soli').val()));
      fonte.set('observacio', $('#editFonteModal #observacio').text().trim() || null);
      fonte.set('tipo_fonte', $('#editFonteModal #fonte_tipo option:selected').text().trim() || null);
    });

    // - on show
    $('#editFonteModal').on('show.bs.modal', function(event){
      // this is the modal itself
      $(this).find('#observacio').text(fonte.get('observacio'));
      $(this).find('#c_soli').val(fonte.get('c_soli'));
      $(this).find('#fonte_tipo option:selected').removeAttr('selected');
      $(this).find('#fonte_tipo option').each(function(index, option){
        var widgetVal = fonte.get('tipo_fonte') + '';
        if(widgetVal === 'null') widgetVal = '';
        if(widgetVal === option.value){
          $(option).attr('selected', 'selected');
        }
      });
    });

  },

  fillSelect: function (collection, response, options) {
    var tipoAgua = this.model.get('tipo_agua');
    new Backbone.UILib.SelectView({
      el: $('#editFonteModal #fonte_tipo'),
      collection: collection.byCategory('fonte_tipo').byParent(tipoAgua)
    }).render();
  },

});
