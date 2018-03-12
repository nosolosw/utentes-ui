Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewJuridicoNotEditable1 = Backbone.SIXHIARA.ViewJuridico1.extend({

    // Re-render the title of the todo item.
    render: function() {
        var view = Backbone.SIXHIARA.ViewJuridico1.prototype.render.call(this);
        this.$('input, textarea, button').prop('disabled', function() {return true;});
        this.$('#bt-ver-doc').prop('disabled', false);
        return view;
    },
});
