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
                <button type="button" class="btn btn-default">Subir doc</button>
            </div>
            <div class="btn-group" role="group">
                <button id="bt-ver-doc" type="button" class="btn btn-default">Ver doc</button>
            </div>
        </div>

        <div class="">
            <h2><%- exp_id %></h2>

          <div class="form-group">
                <label for="exp_name">Nome</label>
                <input type="text" class="form-control widget" id="exp_name" required value="<%- exp_name %>">
          </div>


            <div class="checkbox">
                <label>
                    <input id="carta" type="checkbox" value="" <%- carta ? 'checked' : '' %>>
                    Carta de requerimento
                </label>
            </div>

            <div class="checkbox">
                <label>
                    <input id="ficha" type="checkbox" value="" <%- ficha ? 'checked' : '' %>>
                    Ficha de pedido preenchida
                </label>
            </div>

            <div class="checkbox">
                <label>
                    <input id="certificado" type="checkbox" value="" <%- certificado ? 'checked' : '' %>>
                    Certificado de registro comercial
                </label>
            </div>

            <div class="checkbox">
                <label>
                    <input id="duat" type="checkbox" value="" <%- duat ? 'checked' : '' %>>
                    DUAT
                </label>
            </div>

            <div class="checkbox">
                <label>
                    <input id="licencia_ambiental" type="checkbox" value="" <%- licencia_ambiental ? 'checked' : '' %>>
                    Licença Ambiental (Se é preciso)
                </label>
            </div>

            <div class="checkbox">
                <label>
                    <input id="mapa" type="checkbox" value="" <%- mapa ? 'checked' : '' %>>
                    Mapa de localização
                </label>
            </div>

            <div class="checkbox">
                <label>
                    <input id="licencia_apertura" type="checkbox" value="" <%- licencia_apertura ? 'checked' : '' %>>
                    Licença de apertura de poço/furo (So para licenças subterrâneas)
                </label>
            </div>
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
        this.$('input, textarea, button').prop('disabled', function() {return true;});
        this.$('#bt-ok').prop('disabled', false);
        this.$('#bt-no').prop('disabled', false);

        return this;
    },

    nextState: function(e) {
        this.fillExploracao(e);
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
                'observacio': observacio,
            },
            {
                'patch': true,
                'validate': false
            }
        );
    },
});
