Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewSecretaria2 = Backbone.View.extend({
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
        </div>

        <h3><%- exp_id %> <%- exp_name %></h3>


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
            <button id="bt-ok" type="button" class="btn btn-default" disabled>Diferido</button>
            <button id="bt-no" type="button" class="btn btn-primary" disabled>Indiferido</button>
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
        $('[data-toggle="tooltip"]').tooltip();
    },
});
