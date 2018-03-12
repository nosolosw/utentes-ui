Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewJuridico1 = Backbone.View.extend({
    tagName:  'div',

    // optional, you can assign multiple classes to
    // this property like so: 'container homepage'
    className: 'myclass',

    // Note: When declaring a View, options, el, tagName, id and className
    // may be defined as functions, if you want their values to be determined
    // at runtime.
    id: 'myid', // optional
    template: _.template(`
        <h2><%- exp_id %></h2>
        <div class="btn-group btn-group-justified" role="group" style="margin: 0px 5px 5px 5px">
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-default">Subir doc</button>
            </div>
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-default">Ver doc</button>
            </div>
        </div>

        <div class="row">
        <span style="float:left">Carta requerimento</span>
  <div class="col-xs-3">
    <div class="input-group">
      <span class="input-group-addon">
        <input type="checkbox">
      </span>
      <input type="text" class="form-control" value="Comentario del administrativo">
    </div><!-- /input-group -->
  </div><!-- /.col-xs-3 -->
  <div class="col-xs-3">
    <div class="input-group">
      <span class="input-group-addon">
        <input type="checkbox" aria-label="...">
      </span>
      <input type="text" class="form-control" value="Comentario del jurídico">
    </div><!-- /input-group -->
  </div><!-- /.col-xs-3 -->
</div><!-- /.row -->

        <div class="row">
        <span style="float:left">Ficha de pedido preenchida</span>
  <div class="col-xs-3">
    <div class="input-group">
      <span class="input-group-addon">
        <input type="checkbox">
      </span>
      <input type="text" class="form-control" value="Comentario del administrativo">
    </div><!-- /input-group -->
  </div><!-- /.col-xs-3 -->
  <div class="col-xs-3">
    <div class="input-group">
      <span class="input-group-addon">
        <input type="checkbox" aria-label="...">
      </span>
      <input type="text" class="form-control" value="Comentario del jurídico">
    </div><!-- /input-group -->
  </div><!-- /.col-xs-3 -->
</div><!-- /.row -->

        <div class="row">


          <div class="form-group col-xs-10">
                <label for="exp_name">Nome</label>
                <input type="text" class="form-control widget" id="exp_name" value="El nombre introducido por el administrativo">
          </div>

          <table class="table table-bordered col-xs-10">
          <thead>
          <tr><th>Documento</th><th>Presentado</th><th>Válido</th><th>Adjunto</th></tr>
          </thead>
          <tbody>
          <tr><td>Carta de requerimento</td><td><input type="checkbox" value=""></td><td><input type="checkbox" value=""></td><td><i class="fa fa-info"></i></td></tr>
          <tr><td>Ficha de pedido preenchida</td><td><input type="checkbox" value=""></td><td><input type="checkbox" value=""></td><td><a href="#">ficha_juan.docx</a></td></tr>
          <tr><td>Certificado de registro comercial</td><td><input type="checkbox" value=""></td><td><input type="checkbox" value=""></td><td><i class="fa fa-info"></i></td></tr>
          <tr><td>DUAT</td><td><input type="checkbox" value=""></td><td><input type="checkbox" value=""></td><td><i class="fa fa-info"></i></td></tr>
          <tr><td>Licença Ambiental (Se é preciso)</td><td><input type="checkbox" value=""></td><td><input type="checkbox" value=""></td><td><i class="fa fa-info"></i></td></tr>
          <tr><td>Mapa de localização</td><td><input type="checkbox" value=""></td><td><input type="checkbox" value=""></td><td><i class="fa fa-info"></i></td></tr>
          <tr><td>Licença de apertura de poço/furo (So para licenças subterrâneas)</td><td><input type="checkbox" value=""></td><td><input type="checkbox" value=""></td><td><i class="fa fa-info"></i></td></tr>
          </tbody>
          </table>

        </div> <!-- div.row -->

                    <div class="row pull-right">
                      <div class="form-group">
                        <label for="observacio">Observações</label>
                        <textarea class="form-control widget" id="observacio" rows="5">
                          Pensar si con esto llega. O si hay que ponerlo en una modal al darle a los botones. O si estos comentarios son distintos a los asociados al cambio de estado.
                        </textarea>
                      </div>
                    </div>

                    <div class="row" style="margin: 5px 5px 0px 5px">
                        <button type="button" class="btn btn-default">Completa</button>
                        <button type="button" class="btn btn-primary">Incompleta</button>
                    </div>

    `),

    initialize: function (options) {
        this.options = options || {};
    },

    // Re-render the title of the todo item.
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
});
