Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EditFonteModalView = Backbone.View.extend({

  render: function(){
    var app = this;
    var fonte = this.model;

    var modalTmpl = $('#edit-fonte-modal-tmpl').html();
    var node = $(document.body).append(modalTmpl);

    // on hide
    $('#editFonteModal').on('hidden.bs.modal', function () {
      // this is the modal itself
      $(this).remove();
    });

    $('#editFonteModal #updateFonte').on('click', function(event){
      $('#editFonteModal').modal('hide');
      fonte.set('c_soli', formatter().unformatNumber($('#editFonteModal #c_soli').val()));
      fonte.set('observacio', $('#editFonteModal #observacio').text().trim() || null);
      fonte.set('tipo_fonte', $('#editFonteModal #fonte_tipo option:selected').text().trim() || null);
    });

    // on show
    $('#editFonteModal').on('show.bs.modal', function(event){
      // TODO: this is called as many times as the user has previously
      // opened the fonte modal. Fix it.
      // Related: https://github.com/twbs/bootstrap/issues/17732
      // bootstrap seem to add the modal to the DOM every time
      // modal('toggle') is called but only hides it on close.
      $(this).find('#c_soli').val(fonte.get('c_soli'));
      $(this).find('#observacio').text(fonte.get('observacio'));
      $(this).find('#fonte_tipo option:selected').removeAttr('selected');
      $(this).find('#fonte_tipo option').each(function(index, option){
        var widgetVal = fonte.get('tipo_fonte') + '';
        if(widgetVal === 'null') widgetVal = '';
        if(widgetVal === option.value){
          $(option).attr('selected', 'selected');
        }
      });
    });

    // make select work
    new Backbone.UILib.SelectView({
      el: $('#editFonteModal #fonte_tipo'),
      collection: domains.byCategory('fonte_tipo').byParent(fonte.get('tipo_agua'))
    }).render();

    $('#editFonteModal').modal('show');
  }

});
