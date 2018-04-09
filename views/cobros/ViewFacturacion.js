Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFacturacion = Backbone.View.extend({
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
                <button type="button" class="btn btn-default" disabled>Factura (emissão licença)</button>
            </div>
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-default" disabled>Factura (consumo)</button>
            </div>
        </div>

        <h3><%- exp_id %> <%- exp_name %></h3>

        <div class="row form-horizontal">
            <div class="col-xs-4">
                <div class="form-group">
                  <label for="pago_lic" class="col-sm-6 control-label">Pagamento emissão licença</label>
                  <div class="col-xs-6">
                    <select class="form-control" id="pago_lic" disabled >
                        <option value="<%- facturacion[facturacion.length - 1].pago_lic %>" >Si</option>
                        <option selected>Não</option>
                    </select>
                  </div>
                </div>
            </div>
            <!--
            <div class="col-xs-4">
                <div class="form-group">
                  <label for="pago_c_mes" class="col-sm-6 control-label">Factura emitida</label>
                  <div class="col-xs-6">
                    <select class="form-control" id="factura_emitida" disabled >
                        <option value="<%- facturacion[facturacion.length - 1].factura_emitida %>" >Si</option>
                        <option selected>Não</option>
                    </select>
                  </div>
                </div>
            </div>
            -->
            <div class="col-xs-4">
                <div class="form-group">
                  <label for="factura_emitida" class="col-sm-6 control-label">Factura emitida</label>
                  <div class="col-xs-6">
                    <input type="text" class="form-control" value="<%- facturacion[facturacion.length - 1].factura_emitida %>" disabled>
                  </div>
                </div>
            </div>
            <!--
            <div class="col-xs-4">
                <div class="form-group">
                  <label for="pago_c_mes" class="col-sm-6 control-label">Pagamento consumos mensais</label>
                  <div class="col-xs-6">
                    <select class="form-control" id="pago_c_mes" disabled >
                        <option value="<%- facturacion[facturacion.length - 1].pago_c_mes %>" >Si</option>
                        <option selected>Não</option>
                    </select>
                  </div>
                </div>
            </div>
            -->
            <div class="col-xs-4">
                <div class="form-group">
                  <label for="pago_c_mes" class="col-sm-6 control-label">Pagamento consumos mensais</label>
                  <div class="col-xs-6">
                    <input type="text" class="form-control" value="<%- facturacion[facturacion.length - 1].pago_c_mes %>" disabled>
                  </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-xs-4">
                <div class="panel panel-info">
                    <div class="panel-heading">
                        <h3 class="panel-title"><strong>Pagamentos mensais</strong></h3>
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="form-group col-xs-12">
                                <label for="taxa_fixa">Taxa fixa <i class="units">(MZN/mês)</i></label>
                                <input type="text" class="form-control widget-number" id="taxa_fixa" pattern="[0-9]{1,8}([,][0-9]{1,2})?" disabled value="<%- facturacion[facturacion.length - 1].taxa_fixa %>">
                            </div>
                            <div class="form-group col-xs-12">
                                <label for="taxa_uso">Taxa de uso <i class="units">(MZN/m<sup>3</sup>)</i></label>
                                <input type="text" class="form-control widget-number" id="taxa_uso" pattern="[0-9]{1,8}([,][0-9]{1,2})?" disabled value="<%- facturacion[facturacion.length - 1].taxa_uso %>">
                            </div>
                            <div class="form-group col-xs-12">
                                <label for="iva">IVA <i class="units">(%)</i></label>
                                <input type="number" class="form-control widget-number" id="iva" pattern="[0-9]{1,2}?" disabled value="<%- facturacion[facturacion.length - 1].iva %>">
                            </div>
                            <div class="form-group col-xs-12">
                                <label for="pago_mes">Valor pago mês <i class="units">(MZN/més)</i></label>
                                <input type="text" class="form-control widget-number" id="pago_mes" pattern="[0-9]{1,8}([,][0-9]{1,2})?" disabled value="<%- facturacion[facturacion.length - 1].pago_mes %>">
                            </div>
                            <div class="form-group col-xs-12">
                                <label for="pago_iva">Valor com IVA <i class="units">(MZN/mês)</i></label>
                                <input type="text" class="form-control widget-number" id="pago_iva" pattern="[0-9]{1,8}([,][0-9]{1,2})?" disabled value="<%- facturacion[facturacion.length - 1].pago_iva || 17 %>">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xs-4">
                <div class="panel panel-info">
                    <div class="panel-heading">
                        <h3 class="panel-title"><strong>Consumos</strong></h3>
                    </div>
                    <div class="panel-body">
                        <div class="row">
                          <div class="form-group col-xs-12">
                            <label for="consumo_tipo"><strong>Tipo de consumo</strong></label>
                            <input type="text" class="form-control widget" id="consumo_tipo" value="<%- consumo_tipo %>" disabled>
                          </div>
                          <div class="form-group col-xs-12">
                            <label for="c_licencia">Consumo licenciado <i class="units">(m<sup>3</sup>/mês)</i></label>
                            <input type="text" class="form-control widget-number" id="c_licencia" pattern="[0-9]{1,8}([,][0-9]{1,2})?" disabled value="<%- c_licencia %>">
                          </div>
                          <div class="form-group col-xs-12">
                            <label for="c_facturado">Consumo facturado <i class="units">(m<sup>3</sup>/mês)</i></label>
                            <input type="text" class="form-control widget-number" id="c_facturado" pattern="[0-9]{1,8}([,][0-9]{1,2})?" value="<%- facturacion[facturacion.length - 1].c_facturado %>" required disabled>
                          </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xs-4">
                <div class="panel panel-info">
                    <div class="panel-heading">
                        <h3 class="panel-title"><strong>Histórico</strong></h3>
                    </div>
                    <div class="panel-body">
                        <div>
                          <ul id="historico">
                          <% for (var i=0; i< facturacion.length; i+=1) {
                              print('<li><a href="#">' + formatter().formatDate(facturacion[i].date_reset) + '</a>' + ': ' + (formatter().formatNumber(facturacion[i].pago_mes) || '-') + ': ' + facturacion[i].estado_facturacion + '</li>')
                          }
                          %>
                          </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <div class="form-group row">
            <label for="observacio_ant">Observações anteriores</label>
              <textarea class="form-control widget" id="observacio_ant" rows="5" required disabled>
              <% for (var i=0; i< facturacion[facturacion.length - 1].comments.length; i+=1) {
print('El ' + facturacion[facturacion.length - 1].comments[i]['create_at'] + ', ' + facturacion[facturacion.length - 1].comments[i]['author'] + ', escribió: ' + facturacion[facturacion.length - 1].comments[i]['text'] + '&#13;&#10;&#13;&#10;');
              }
              %>
              </textarea>
        </div>

        <div class="form-group row">
            <label for="observacio">Observações <i class="fa fa-question-circle" data-toggle="tooltip" title="Debe escribir un comentario de al menos 10 caracteres"></i></label>
              <textarea class="form-control widget" id="observacio" rows="2" required></textarea>
        </div>

        <div id="js-btns-next" class="row" style="margin: 5px 5px 0px 5px">
            <!-- TODO. Los "siguientes estados" disponibles no deberían estar harcodeados en el html
            o bien, todos los botones deberían ser generados en otra parte, o de los dominios se deberían decidir que botones
            se pueden usar en el modo combo o algo así
            -->
            <button id="bt-ok" type="button" class="btn btn-default">Diferida</button>
            <button id="bt-no" type="button" class="btn btn-primary" disabled>Indiferida</button>
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
        self = this;
        document.getElementById('js-btns-next').addEventListener('click',  function(e) {self.fillExploracao(e);} );
        $('[data-toggle="tooltip"]').tooltip();

        $('#historico li a').click(function(){
            var i = $(this).parent().index();
            self.renderModal(i);
        });
        document.getElementById('bt-no').style.display = 'none';
        var json = this.model.toJSON();
        Object.assign(json, JSON.parse(this.model.get('observacio')));
        this.setSelectedText('pago_lic', json.facturacion[json.facturacion.length - 1].pago_lic);
    },

    saveExploracao: function(observacio, nextState) {
        console.log('Salvando...')
        var self = this;
        var exploracao = this.model;
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
                        // self.alreadySaved = true;
                        window.alert('Los datos se han guardado correctamente');
                    },
                    'error': function() {
                        window.alert('Se ha producido un error. Informe al administrador');
                    },
                }
            );
        };
    },

    renderModal: function (i) {
        var json = this.model.toJSON();
        var ob = JSON.parse(this.model.get('observacio'));
        var fact = ob.facturacion[i]
        Object.assign(json, fact);
        var model = new Backbone.Model();
        model.set(json);

        var modalView = new Backbone.UILib.ModalView({
            model: model,
            selectorTmpl: '#block-historic-modal-tmpl'
        });

        // // connect auxiliary views
        // var selectLocation = new Backbone.SIXHIARA.SelectLocationView({
        //     el: modalView.$('#editLocModal'),
        //     model: modalView.draftModel,
        //     domains: this.options.domains,
        //     domainsKeys: ['provincia', 'distrito', 'posto'],
        // }).render()
        // modalView.addAuxView(selectLocation);
        //
        // var selectBacia = new Backbone.SIXHIARA.SelectBaciaView({
        //     el: modalView.$('#editLocModal'),
        //     model: modalView.draftModel,
        //     domains: this.options.domains,
        // }).render()
        // modalView.addAuxView(selectBacia);

        modalView.render();
        // modalView.show();

    },
    //
    // saveData: function() {
    //     this.fillExploracao();
    // },

    getSelectText: function(selectId) {
        var select = document.getElementById(selectId);
        return select.options[select.selectedIndex].text;
    },

    setSelectedText: function(selectId, text) {
        var select = document.getElementById(selectId);
        for (var i = 0; i< select.options.length; i+=1) {
            if (select.options[i].text !== text) {
                select.options[i].selected = false;
            } else {
                select.options[i].selected = true;
            }
        }
    }
});
