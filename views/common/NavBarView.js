Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.NavBarView = Backbone.View.extend({

html: `<img class="col-xs-2" src="img/logo.png" alt="Logo" />
    <div class="col-xs-1 pull-right text-center">
      <div class="row">
        <a id="settings" href="#" class="col-xs-offset-6 col-xs-6 ">
          <i class="fa fa-cog"></i>
        </a>
      </div>
    </div>
    <a href="exploracao-new.html" class="col-xs-1 pull-right text-center">
      <strong id="new">ADICIONAR</strong>
    </a>
    <a href="exploracao-gps.html" class="col-xs-1 pull-right text-center">
      <strong id="gps">GPS</strong>
    </a>
    <a href="utentes.html" class="col-xs-1 pull-right text-center">
      <strong id="utentes">UTENTES</strong>
    </a>
    <a href="exploracao-search.html" class="col-xs-2 pull-right text-center">
      <strong id="search">EXPLORAÇÕES</strong>
    </a>`,

      initialize: function(options) {
        this.options = options || {};
        this.template = _.template(this.html);
      },

      render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        var active = window.location.pathname.split("/").pop();
        this.$('a[href="' + active + '"]').addClass('active');
        return this;
      },

});
/*
$.each($('ul.nav > li'), function() {
  $(this).toggleClass('active',
    active.indexOf($(this).find('a').attr('href')) > -1);
});

$('ul.nav > li.active').removeClass('active');
var active = window.location.pathname;
// var active = window.location.pathname.split("/").pop();
$('ul.nav > li > a[href="' + active + '"]').parent().addClass('active');
*/
