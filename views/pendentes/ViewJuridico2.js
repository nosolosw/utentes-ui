Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewJuridico2 = Backbone.View.extend({
    tagName:  'div',

    // optional, you can assign multiple classes to
    // this property like so: 'container homepage'
    className: 'myclass',

    // Note: When declaring a View, options, el, tagName, id and className
    // may be defined as functions, if you want their values to be determined
    // at runtime.
    id: 'myid', // optional
    template: _.template(`

        <div class="btn-group btn-group-justified" role="group" style="margin: 0px 5px 5px 5px">
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-default">Subir doc</button>
            </div>
            <div class="btn-group" role="group">
                <button id="bt-ver-doc" type="button" class="btn btn-default">Ver doc</button>
            </div>
            <div class="btn-group" role="group">
                <a id="bt-ficha" class="btn btn-default" role="button" href="/static/utentes-ui/exploracao-show.html?id=<%- id %>">Ficha</a>
            </div>
            <div class="btn-group" role="group">
                <button id="bt-print-license" type="button" class="btn btn-default">Imprimir Licencia</button>
            </div>
        </div>

        <h3><%- exp_id %> <%- exp_name %></h3>

        <table class="table table-bordered col-xs-10">
            <thead>
              <tr><th>Documento</th><th>Listo</th><th></th><th></th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Documentação Legal</td>
                <td><input id="juri2_doc_legal" type="checkbox" <%- juri2_doc_legal ? 'checked' : '' %> required></td>
                <td></td>
                <td></i></td>
              </tr>
              <tr>
                <td>Parecer Técnico</td>
                <td><input id="juri2_parecer_tecnico" type="checkbox" <%- juri2_parecer_tecnico ? 'checked' : '' %> required></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Parecer de Instituções Relevantes</td>
                <td><input id="juri2_parecer_relevantes" type="checkbox" <%- juri2_parecer_relevantes ? 'checked' : '' %> required></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
        </table>

        <div class="form-group">
            <label for="observacio_ant">Observações anteriores</label>
              <textarea class="form-control widget" id="observacio_ant" rows="5" required disabled>
              <% for (var i=0; i<comments.length; i+=1) {
print('El ' + comments[i]['create_at'] + ', ' + comments[i]['author'] + ', escribió: ' + comments[i]['text'] + '&#13;&#10;&#13;&#10;');
              }
              %>
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
        document.querySelectorAll('table input[type="checkbox"]').forEach(function(input){
            input.addEventListener('change', self.enableOkBt);
        });

        document.getElementById('observacio').addEventListener('input', self.enableOkBt);

        document.getElementById('js-btns-next').addEventListener('click', function(e){
            self.fillExploracao(e);
        });

        self.enableOkBt();

        $('[data-toggle="tooltip"]').tooltip();
    },

    enableOkBt: function() {
        var enable = Array.from(
            document.querySelectorAll('table input[type="checkbox"]')
        ).every(input => input.checked);
        var observacio = document.getElementById('observacio');
        enable = enable && observacio && observacio.value && observacio.value.length >= 10;

        document.getElementById('bt-ok').disabled = !enable;
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

        document.querySelectorAll('table input[type="checkbox"]').forEach(function(input){
            observacio[input.id] = input.checked;
        });

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
