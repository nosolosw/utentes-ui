Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ModalView = Backbone.View.extend({

    events: {
        'click #okbutton': 'okButtonClicked'
    },

    initialize:function(options) {
        this.options = options || {};
        if (this.options.modalSelectorTpl) {
            this.template = _.template($(this.options.modalSelectorTpl).html());
        } else if (this.html) {
            this.template = _.template(this.html);
        } else {
            throw 'Bad configuration';
        }
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        if (this.options.textConfirmBt) {
            this.$('#okbutton').text(this.options.textConfirmBt);
        }
        return this;
    },

    show: function() {
        $(document.body).append(this.render().el);
        var self = this;

        this.widgetModel = this.model;
        if (this.options.editing) {
            this.widgetModel = this.model.clone();
        }

        this.customConfiguration();

        new Backbone.UILib.WidgetsView({
            el: this.$el,
            model: this.widgetModel
        }).render()

        this.$('.modal').on('hidden.bs.modal', function(){
            self._close();
        });
        this.$('.modal').modal('show');
    },

    _close: function() {
        this.$('.modal').unbind();
        this.$('.modal').remove();
        this.remove();
    },

    okButtonClicked: function(){
        if (this.options.editing) {
            var widgets = this.$('.modal').find('.widget, .widget-number, .widget-date, .widget-boolean, .widget-external');
            var widgetsId = _.map(widgets, function(w){return w.id});
            var attrs = this.widgetModel.pick(widgetsId);
            this.model.set(attrs);
        } else {
            this.collection.add(this.model);
        }
        this.$('.modal').modal('hide');
    },

    remove: function() {
        this.$el.unbind();
        this.off();
        Backbone.View.prototype.remove.call(this);
    },

    customConfiguration: function() {
        // To be implemented by child classes
    },

});
