Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewTecnico1 = Backbone.View.extend({
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
            <div class="btn-group" role="group">
                <a class="btn btn-default" role="button" href="/static/utentes-ui/exploracao-new.html?exp_id=<%- id %>">Adicionar</a>
            </div>
            <div class="btn-group" role="group">
                <button id="bt-ficha" type="button" class="btn btn-default">Ficha</button>
            </div>
            <div class="btn-group" role="group">
                <a class="btn btn-default" role="button" href="/static/utentes-ui/exploracao-gps.html">GPS</a>
            </div>
        </div>



        <div class="row">

        <form>
          <div class="form-group col-xs-10">
                <label for="exp_name">Nome</label>
                <input type="text" class="form-control widget" id="exp_name" value="<%- exp_name %>">
          </div>

          <div class="checkbox">
              <label>
                  <input id="analisis_doc" type="checkbox" value="" <%- analisis_doc ? 'checked' : '' %>>
                  Análisis da documentação
              </label>
          </div>

          <div class="checkbox">
              <label>
                  <input id="sol_visita" type="checkbox" value="" <%- sol_visita ? 'checked' : '' %>>
                  Solicitação da visitoria
              </label>
          </div>

          <div class="checkbox">
              <label>
                  <input id="parecer_unidade" type="checkbox" value="" <%- parecer_unidade ? 'checked' : '' %>>
                  Parecer da Unidade
              </label>
          </div>

          <div class="checkbox">
              <label>
                  <input id="parecer_tecnico" type="checkbox" value="" <%- parecer_tecnico ? 'checked' : '' %>>
                  Parecer Técnico
              </label>
          </div>

        </div> <!-- div.row -->

                    <div class="row pull-right">
                      <div class="form-group">
                        <label for="observacio">Observações</label>
                        <textarea class="form-control widget" id="observacio" rows="5">
                            <%- comments[comments.length - 1]['text'] %>
                        </textarea>
                      </div>
                    </div>
</form>
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
        Object.assign(json, JSON.parse(this.model.get('observacio')));
        this.$el.html(this.template(json));
        return this;
    },


    /*
    Esto en realidad está por no  usar jquery. Si se hace en render todavía no están en el
    DOM los elementos y no se puede usar document ¿?. Con jquery en cambio se quedan
    binded para después al usar this.$
    */
    init: function() {
        var self = this;
        document.querySelectorAll('form input[type="checkbox"]').forEach(function(input){
            input.addEventListener('change', self.enableOkBt);
        });

        document.getElementById('observacio').addEventListener('input', self.enableOkBt);
        document.getElementById('exp_name').addEventListener('input', self.enableOkBt);

        document.getElementById('js-btns-next').addEventListener('click', function(e){
            self.fillExploracao(e);
        });

        self.enableOkBt();

        $('[data-toggle="tooltip"]').tooltip();
    },

    enableOkBt: function() {
        var enable = Array.from(
            document.querySelectorAll('form input[type="checkbox"]')
        ).every(input => input.checked);
        var observacio = document.getElementById('observacio');
        enable = enable && observacio && observacio.value && observacio.value.length >= 10;

        var exp_name = document.getElementById('exp_name');

        enable = enable && exp_name.value && exp_name.value.length > 3;
        document.getElementById('bt-ok').disabled = !enable;
    },

    fillExploracao: function(e) {
        var observacio = JSON.parse(this.model.get('observacio'));

        document.querySelectorAll('form input[type="checkbox"]').forEach(function(input){
            observacio[input.id] = input.checked;
        });

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
