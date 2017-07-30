Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TemplateEditTanque = Backbone.View.extend({

html: `<!-- modal engadir tanque -->
<script type="text/template" id="tanqueModalTpl">
<div class="modal fade" id="tanqueModal" tabindex="-1" role="dialog" aria-labelledby="tanqueModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Pechar"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="tanqueModalLabel">Tanque</h4>
      </div>
      <div class="modal-body">

        <div class="row">
          <div class="form-group col-xs-offset-1 col-xs-4">
            <label for="tipo">Tipo de tanque</label>
            <select class="form-control widget" id="tipo" required></select>
          </div>
          <div class="form-group col-xs-offset-2 col-xs-4">
            <label for="cumprimen">Cumprimento<i class="units">(m)</i></label>
            <input type="text" class="form-control widget-number" id="cumprimen" pattern="[0-9]{1,8}([,][0-9]{1,2})?" />
          </div>
        </div>

        <div class="row">
          <div class="form-group col-xs-offset-1 col-xs-4">
            <label for="largura">Largura<i class="units">(m)</i></label>
            <input type="text" class="form-control widget-number" id="largura" pattern="[0-9]{1,8}([,][0-9]{1,4})?" />
          </div>
          <div class="form-group col-xs-offset-2 col-xs-4">
            <label for="profundid">Profundidade<i class="units">(m)</i></label>
            <input type="text" class="form-control widget-number" id="profundid" pattern="[0-9]{1,8}([,][0-9]{1,2})?" />
          </div>
        </div>

        <div class="row">
          <div class="form-group col-xs-offset-1 col-xs-4">
            <label for="area">Área</label>
            <input type="text" class="form-control widget-number" id="area"/>
          </div>
          <div class="form-group col-xs-offset-2 col-xs-4">
              <label for="area_gps">Área GPS</label>
              <input type="text" class="form-control widget-number" id="area_gps" disabled/>
          </div>
          <div class="form-group col-xs-offset-1 col-xs-4">
            <label for="volume">Volume</label>
            <input type="text" class="form-control widget-number" id="volume"/>
          </div>
        </div>

        <div class="row">
          <div class="form-group col-xs-offset-1 col-xs-4">
            <label for="estado">Estado</label>
            <select class="form-control widget" id="estado"></select>
          </div>
          <div class="form-group col-xs-offset-2 col-xs-4">
            <label for="esp_culti">Espécie Cultivada</label>
            <select class="form-control widget" id="esp_culti" required></select>
          </div>
        </div>

        <div class="row">
          <div class="form-group col-xs-offset-1 col-xs-4">
            <label for="esp_cul_o">Espécie Cultivada (outros)</label>
            <input type="text" class="form-control widget-number" id="esp_cul_o" disabled/>
          </div>
        </div>

        <div class="row">
          <div class="form-group col-xs-offset-1 col-xs-11">
             <label for="tipo_alim">Tipo de alimentaçao</label>
             <div id="tipo_alim"></div>
          </div>
        </div>

        <div class="row">
          <div class="form-group col-xs-offset-1 col-xs-4">
            <label for="tipo_al_o">Tipo de alimentaçao (outros)</label>
            <input type="text" class="form-control widget-number" id="tipo_al_o" disabled/>
          </div>
          <div class="form-group col-xs-offset-2 col-xs-4">
            <label for="n_ale_pov">Nº Alevines</label>
            <input type="text" class="form-control widget-number" id="n_ale_pov" pattern="[0-9]{1,8}" />
          </div>
        </div>

        <div class="row">
          <div class="form-group col-xs-offset-1 col-xs-4">
            <label for="prov_ale">Proveniencia alevines</label>
            <select class="form-control widget" id="prov_ale"></select>
          </div>
          <div class="form-group col-xs-offset-2 col-xs-4">
            <label for="prov_al_o">Proveniencia alevines (outros)</label>
            <input type="text" class="form-control widget-number" id="prov_al_o" disabled/>
          </div>
        </div>

        <div class="row">
          <div class="form-group col-xs-offset-1 col-xs-4">
            <label for="venda">Venda<i class="units">(kg)</i></label>
            <input type="text" class="form-control widget-number" id="venda" pattern="[0-9]{1,8}([,][0-9]{1,4})?" />
          </div>
          <div class="form-group col-xs-offset-2 col-xs-4">
            <label for="consumo">Consumo<i class="units">(kg)</i></label>
            <input type="text" class="form-control widget-number" id="consumo" pattern="[0-9]{1,8}([,][0-9]{1,2})?" />
          </div>
        </div>

        <div class="row">
          <div class="form-group col-xs-offset-1 col-xs-4">
            <label for="pro_anual">Produçao anual<i class="units">(kg)</i></label>
            <input type="text" class="form-control widget-number" id="pro_anual" pattern="[0-9]{1,8}([,][0-9]{1,4})?" />
          </div>
          <div class="form-group col-xs-offset-2 col-xs-4">
            <label for="peso_med">Peso medio peixes<i class="units">(g)</i></label>
            <input type="text" class="form-control widget-number" id="peso_med" pattern="[0-9]{1,8}([,][0-9]{1,2})?" />
          </div>
        </div>

        <div class="row">
          <div class="form-group col-xs-offset-1 col-xs-4">
            <label for="fert_agua">Fertilizaçao água</label>
            <select class="form-control widget" id="fert_agua"></select>
          </div>
          <div class="form-group col-xs-offset-2 col-xs-4">
            <label for="fert_a_o">Fertilizaçao água (outros)</label>
            <input type="text" class="form-control widget-number" id="fert_a_o" disabled/>
          </div>
        </div>

        <div class="row">
          <div class="form-group col-xs-offset-1 col-xs-10">
            <label for="observacio">Observaçôes</label>
            <textarea class="form-control widget" id="observacio" rows="4"></textarea>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <div class="row">
          <div class="col-xs-offset-1 col-xs-10">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" id="okbutton">Aceitar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</script>`,

  initialize: function(options) {
    this.options = options || {};
  },

  render: function() {
    $('body').append(_.template(this.html))
    return this;
  },

});

new Backbone.SIXHIARA.TemplateEditTanque().render();
