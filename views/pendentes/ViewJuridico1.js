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
                <button id="bt-ver-doc" type="button" class="btn btn-default">Ver doc</button>
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
                <input type="text" class="form-control widget" id="exp_name" value="<%- exp_name %>">
          </div>

          <table class="table table-bordered col-xs-10">
          <thead>
          <tr><th>Documento</th><th>Presentado</th><th>Válido</th><th>Adjunto</th></tr>
          </thead>
          <tbody>
          <tr>
            <td>Carta de requerimento</td>
            <td><input id="carta" type="checkbox" value="" <%- carta ? 'checked' : '' %>></td>
            <td><input id="carta_valido" type="checkbox" value="" <%- carta_valido ? 'checked' : '' %>></td>
            <td><i class="fa fa-info"></i></td>
          </tr>
          <tr>
            <td>Ficha de pedido preenchida</td>
            <td><input id="ficha" type="checkbox" value="" <%- ficha ? 'checked' : '' %>></td>
            <td><input id="ficha_valido" type="checkbox" value="" <%- ficha_valido ? 'checked' : '' %>></td>
            <td><a href="#">ficha_juan.docx</a></td>
          </tr>
          <tr>
            <td>Certificado de registro comercial</td>
            <td><input id="certificado" type="checkbox" value="" <%- certificado ? 'checked' : '' %>></td>
            <td><input id="certificado_valido" type="checkbox" value="" <%- certificado_valido ? 'checked' : '' %>></td>
            <td><i class="fa fa-info"></i></td>
          </tr>
          <tr>
            <td>DUAT</td>
            <td><input id="duat" type="checkbox" value="" <%- duat ? 'checked' : '' %>></td>
            <td><input id="duat_valido" type="checkbox" value="" <%- duat_valido ? 'checked' : '' %>></td>
            <td><i class="fa fa-info"></i></td>
          </tr>
          <tr>
            <td>Licença Ambiental (Se é preciso)</td>
            <td><input id="licencia_ambiental" type="checkbox" value="" <%- licencia_ambiental ? 'checked' : '' %>></td>
            <td><input id="licencia_ambiental_valido" type="checkbox" value="" <%- licencia_ambiental_valido ? 'checked' : '' %>></td>
            <td><i class="fa fa-info"></i></td>
          </tr>
          <tr>
            <td>Mapa de localização</td>
            <td><input id="mapa" type="checkbox" value="" <%- mapa ? 'checked' : '' %>></td>
            <td><input id="mapa_valido" type="checkbox" value="" <%- mapa_valido ? 'checked' : '' %>></td>
            <td><i class="fa fa-info"></i></td>
          </tr>
          <tr>
            <td>Licença de apertura de poço/furo (So para licenças subterrâneas)</td>
            <td><input id="licencia_apertura" type="checkbox" value="" <%- licencia_apertura ? 'checked' : '' %>></td>
            <td><input id="licencia_apertura_valido" type="checkbox" value="" <%- licencia_apertura_valido ? 'checked' : '' %>></td>
            <td><i class="fa fa-info"></i></td>
          </tr>
          </tbody>
          </table>

        </div> <!-- div.row -->

                    <div class="row pull-right">
                      <div class="form-group">
                        <label for="observacio">Observações</label>
                        <textarea class="form-control widget" id="observacio" rows="5">
                            <%- comments[0]['text'] %>
                        </textarea>
                      </div>
                    </div>

                    <div id="js-btns-next" class="row" style="margin: 5px 5px 0px 5px">
                        <!-- TODO. Los "siguientes estados" disponibles no deberían estar harcodeados en el html
                        o bien, todos los botones deberían ser generados en otra parte, o de los dominios se deberían decidir que botones
                        se pueden usar en el modo combo o algo así
                        -->
                        <button id="bt-ok" type="button" class="btn btn-default">Completa</button>
                        <button id="bt-no" type="button" class="btn btn-primary">Incompleta</button>
                    </div>

    `),

    initialize: function (options) {
        this.options = options || {};
    },

    // Re-render the title of the todo item.
    render: function() {
        var json = this.model.toJSON();
        Object.assign(json, JSON.parse(this.model.get('observacio')))
        this.$el.html(this.template(json));
        this.$('table input[type="checkbox"]').filter( (x,i) => !i.id.endsWith('_valido') ).prop('disabled', () => true);
        return this;
    },



    init: function() {
        console.log('foo');
        var self = this;
        document.querySelectorAll('table input[type="checkbox"]').forEach(function(input){
            input.addEventListener('change', self.enableOkBt);
        });

        document.getElementById('observacio').addEventListener('input', self.enableOkBt);
        document.getElementById('exp_name').addEventListener('input', self.enableOkBt);

        document.getElementById('js-btns-next').addEventListener('click', function(e){
            self.fillExploracao(e);
        });

        this.enableOkBt();

        $('[data-toggle="tooltip"]').tooltip();
    },

    enableOkBt: function() {
        var enable = Array.from(
            document.querySelectorAll('table input[type="checkbox"]')
        ).every(input => {
            if (!input.id.endsWith('_valido')) {
                return true;
            }
            return ['licencia_ambiental_valido', 'licencia_apertura_valido'].indexOf(input.id) !== -1 || input.checked;
        });
        var observacio = document.getElementById('observacio');
        enable = enable && observacio && observacio.value && observacio.value.length >= 10;

        var exp_name = document.getElementById('exp_name');

        enable = enable && exp_name.value && exp_name.value.length > 3;
        document.getElementById('bt-ok').disabled = !enable;
    },

    fillExploracao: function(e) {
        var observacio = JSON.parse(this.model.get('observacio'));

        var nextState = wf.whichNextState(observacio['state'], e);
        observacio['comments'] = observacio['comments'] || [];
        observacio['comments'].push({
            'create_at': new Date(),
            'author': wf.getUser(),
            'text': document.getElementById('observacio').value,
            'state': nextState,
        });

        observacio['state'] = nextState;

        this.model.urlRoot = '/api/requerimento';
        this.model.save(
            {
                'exp_name': document.getElementById('exp_name').value,
                'observacio': observacio,
            },
            {
                'patch': true,
                'validate': false
            }
        );
    },
});
