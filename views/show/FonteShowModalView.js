Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FonteShowModalView = Backbone.SIXHIARA.ModalView.extend({

  html: `
  <div class="modal fade" id="editFonteModal" tabindex="-1" role="dialog" aria-labelledby="fonteModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Pechar" aria-hidden="true">&times;</button>
          <h4 class="modal-title" id="fonteModalLabel">Fonte</h4>
        </div>
        <div class="modal-body">

          <div class="row">
            <div class="form-group col-xs-offset-1 col-xs-4">
              <label for="tipo_agua">Tipo de água</label>
              <input type="text" class="form-control widget disabled" id="tipo_agua" />
            </div>
            <div class="form-group col-xs-offset-1 col-xs-4">
              <label for="tipo_fonte">Tipo de fonte</label>
              <select class="form-control widget" id="tipo_fonte"></select>
            </div>
          </div>

          <div class="row">
            <div class="form-group col-xs-offset-1 col-xs-4">
              <label for="c_soli">C. solicitado <i class="units">(m<sup>3</sup>/més)</i></label>
              <input type="text" class="form-control widget-number" id="c_soli" />
            </div>
            <div class="form-group col-xs-offset-1 col-xs-4">
              <label for="c_real">C. real <i class="units">(m<sup>3</sup>/més)</i></label>
              <input type="text" class="form-control widget-number" id="c_real" />
            </div>
            <div class="form-group col-xs-offset-1 col-xs-4">
              <label for="c_max">Máximo caudal extraíble <i class="units">(m<sup>3</sup>/més)</i></label>
              <input type="text" class="form-control widget-number" id="c_max" />
            </div>
          </div>

          <div class="row">
            <div class="form-group col-xs-offset-1 col-xs-4">
              <label for="contador">Contador</label>
              <select class="form-control widget-boolean" id="contador"></select>
            </div>
            <div class="form-group col-xs-offset-1 col-xs-4">
              <label for="metodo_est">Método estimação volume</label>
              <input type="text" class="form-control widget" id="metodo_est" />
            </div>
          </div>

          <div class="row">
          <div class="form-group col-xs-offset-1 col-xs-4">
            <label for="d_dado">Data toma de dados</label>
            <input type="text" class="form-control widget-date" id="d_dado" placeholder="dd/mm/yyyy"/>
          </div>
            <div class="form-group col-xs-offset-1 col-xs-4">
              <label for="lat_lon">Lat / Lon</label>
              <input type="text" class="form-control widget" id="lat_lon" />
            </div>
          </div>
          <div class="row">
            <div class="form-group col-xs-offset-1 col-xs-9">
              <label for="observacio">Observaçôes</label>
              <textarea class="form-control widget" id="observacio" rows="3"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary" id="okbutton">Aceptar</button>
        </div>
      </div>
    </div>
  </div>
  `,

  customConfiguration: function() {
    new Backbone.UILib.SelectView({
      el: this.$('#tipo_fonte'),
      collection: this.options.domains.byCategory('fonte_tipo').byParent(this.model.get('tipo_agua'))
    }).render();

    new Backbone.UILib.SelectView({
      el: this.$('#contador'),
      collection: this.options.domains.byCategory('contador')
    }).render();

    this.$('#tipo_agua').prop('disabled', true)
  },

});
