Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.View1 = Backbone.View.extend({
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
                <button type="button" class="btn btn-default">Ver doc</button>
            </div>
        </div>

        <div class="">
            <h2><%- exp_id %></h2>

          <div class="form-group">
                <label for="exp_name">Nome</label>
                <input type="text" class="form-control widget" id="exp_name" required>
          </div>


            <div class="checkbox">
                <label>
                    <input type="checkbox" value="">
                    Carta de requerimento
                </label>
            </div>

            <div class="checkbox">
                <label>
                    <input type="checkbox" value="">
                    Ficha de pedido preenchida
                </label>
            </div>

            <div class="checkbox">
                <label>
                    <input type="checkbox" value="">
                    Certificado de registro comercial
                </label>
            </div>

            <div class="checkbox">
                <label>
                    <input type="checkbox" value="">
                    DUAT
                </label>
            </div>

            <div class="checkbox">
                <label>
                    <input type="checkbox" value="">
                    Licença Ambiental (Se é preciso)
                </label>
            </div>

            <div class="checkbox">
                <label>
                    <input type="checkbox" value="">
                    Mapa de localização
                </label>
            </div>

            <div class="checkbox">
                <label>
                    <input type="checkbox" value="">
                    Licença de apertura de poço/furo (So para licenças subterrâneas)
                </label>
            </div>
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
