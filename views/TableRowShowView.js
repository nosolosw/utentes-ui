Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TableRowShowView = Backbone.View.extend({

  tagName: 'tr',

  template: _.template('<td class="tipo_agua"><%- tipo_agua %></td><td class="tipo_fonte"><%- tipo_fonte %></td><td class="lat_lon"><%- lat_lon %></td><td class="c_soli"><% print(formatter().formatNumber(c_soli)) %></td><td class="c_max"><% print(formatter().formatNumber(c_max)) %></td><td class="c_real"><% print(formatter().formatNumber(c_real)) %></td><td class="d_dado"><% print(formatter().formatDate(d_dado)) %></td><td class="contador"><% print(formatter().formatBoolean(contador)) %></td><td class="metodo_est"><%- metodo_est %></td><td class="observacio"><%- observacio %></td><td><button type="button" class="edit-fonte btn btn-default btn-xs">Editar</button> <button type="button" class="delete-fonte btn btn-default btn-xs">Eliminar</button></td>'),

  events: {
    'click .delete-fonte': 'modelDestroy',
    'click .edit-fonte': 'modelUpdate',
  },

  initialize: function(){
    this.model.on('remove', this.unrender, this);
    this.model.on('change', this.update, this);
  },

  render: function() {
    this.$el.append(this.template(this.model.toJSON()));

    return this;
  },

  update: function(){
    var fonte = this.model;
    var displayNull = '';
    this.$('td.tipo_agua').text(fonte.get('tipo_agua') || displayNull);
    this.$('td.tipo_fonte').text(fonte.get('tipo_fonte') || displayNull);
    this.$('td.lat_lon').text(fonte.get('lat_lon') || displayNull);
    this.$('td.c_soli').text(fonte.get('c_soli') || displayNull);
    this.$('td.c_max').text(fonte.get('c_max') || displayNull);
    this.$('td.c_real').text(fonte.get('c_real') || displayNull);
    this.$('td.d_dado').text(fonte.get('d_dado') || displayNull);
    this.$('td.contador').text(fonte.get('contador') || displayNull);
    this.$('td.metodo_est').text(fonte.get('metodo_est') || displayNull);
    this.$('td.observacio').text(fonte.get('observacio') || displayNull);
  },

  unrender: function(){
    this.$el.remove();
  },

  modelDestroy: function(e){
    this.model.collection.remove(this.model);
  },

  modelUpdate: function(e){
    e.preventDefault();
    var editFonteModal = new Backbone.SIXHIARA.EditFonteModalView({
      model: this.model
    });
    editFonteModal.render()
  }

});
