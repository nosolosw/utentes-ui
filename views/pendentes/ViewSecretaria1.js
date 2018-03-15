Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewSecretaria1 = Backbone.View.extend({
    tagName:  'div',

    // optional, you can assign multiple classes to
    // this property like so: 'container homepage'
    className: 'myclass',

    // Note: When declaring a View, options, el, tagName, id and className
    // may be defined as functions, if you want their values to be determined
    // at runtime.
    id: 'myid', // optional

    events: {
        'click #js-btns-next': 'nextState',
    },

    template: _.template(`
        <div class="btn-group btn-group-justified" role="group" style="margin: 0px 5px 5px 5px">
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-default" disabled>Subir doc</button>
            </div>
            <div class="btn-group" role="group">
                <button id="bt-ver-doc" type="button" class="btn btn-default">Ver doc</button>
            </div>
        </div>

        <h3><%- exp_id %> <%- exp_name %></h3>

        <table class="table table-bordered col-xs-10">
            <thead>
              <tr><th>Documento</th><th>Presentado</th><th></th><th></th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Carta de requerimento</td>
                <td><input id="carta" type="checkbox" <%- carta ? 'checked' : '' %>></td>
                <td></td>
                <td></i></td>
              </tr>
              <tr>
                <td>Ficha de pedido preenchida</td>
                <td><input id="ficha" type="checkbox" <%- ficha ? 'checked' : '' %>></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Certificado de registro comercial</td>
                <td><input id="certificado" type="checkbox" <%- certificado ? 'checked' : '' %>></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>DUAT</td>
                <td><input id="duat" type="checkbox" <%- duat ? 'checked' : '' %>></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Licença Ambiental (Se é preciso)</td>
                <td><input id="licencia_ambiental" type="checkbox" <%- licencia_ambiental ? 'checked' : '' %>></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Mapa de localização</td>
                <td><input id="mapa" type="checkbox" <%- mapa ? 'checked' : '' %>></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Licença de apertura de poço/furo (So para licenças subterrâneas)</td>
                <td><input id="licencia_apertura" type="checkbox" <%- licencia_apertura ? 'checked' : '' %>></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
        </table>

        <div class="form-group">
            <label for="observacio_ant">Observações anteriores</label>
              <textarea class="form-control widget" id="observacio_ant" rows="5" required disabled>
              El <%- comments[0]['create_at'] %>, <%- comments[0]['author'] %>, escribió: <%- comments[0]['text'] %>
              </textarea>
        </div>

        <div class="form-group">
            <label for="observacio">Observações <i class="fa fa-question-circle" data-toggle="tooltip" title="Debe escribir un comentario de al menos 10 caracteres"></i></label>
              <textarea class="form-control widget" id="observacio" rows="2" required></textarea>
        </div>

        <div id="js-btns-next" class="row" style="margin: 5px 5px 0px 5px">
            <!-- TODO. Los "siguientes estados" disponibles no deberían estar harcodeados en el html
            o bien, todos los botones deberían ser generados en otra parte, o de los dominios se deberían decidir que botones
            se pueden usar en el modo combo o algo así
            -->
            <button id="bt-ok" type="button" class="btn btn-default">Listo</button>
            <button id="bt-no" type="button" class="btn btn-primary">Indiferido</button>
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
        this.$('input, textarea, button').prop('disabled', function() {return true;});
        this.$('#bt-ok').prop('disabled', false);
        this.$('#bt-no').prop('disabled', false);

        return this;
    },

    nextState: function(e) {
        this.fillExploracao(e);
    },

    fillExploracao: function(e) {
        var exploracao = this.model;

        var observacio = JSON.parse(exploracao.get('observacio'));
        var nextState = wf.whichNextState(observacio['state'], e);
        observacio['comments'] = observacio['comments'] || [];
        observacio['comments'].push({
            'create_at': new Date(),
            'author': wf.getUser(),
            'text': document.getElementById('observacio').value,
            'state': nextState,
        });
        observacio['state'] = nextState;

        exploracao.urlRoot = '/api/requerimento';
        if (window.confirm(`A explotación vai mudar o seu estado a: ${nextState}`)) {
            exploracao.save(
                {
                    'observacio': observacio,
                },
                {
                    'patch': true,
                    'validate': false,
                    'wait': true,
                    'success': function() {
                        window.alert('Los datos se han guardado correctamente');
                    },
                    'error': function() {
                        window.alert('Se ha producido un error. Informe al administrador');
                    },
                }
            );
        };
    },
});
