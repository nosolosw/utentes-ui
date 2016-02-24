Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.WidgetsView = Backbone.View.extend({

  // events to update model when widget value changes
  events: {
    "input  .widget":        "updateText",
    "input  .widget-number": "updateNumber",
    "change .widget":        "updateFromOptions"
  },

  render: function(){

    var app = this;

    this.$('span.widget').each(function(index, widget){
      widget.textContent = app.model.get(widget.id);
    });

    this.$('input:checkbox.widget').each(function(index, widget){
      widget.removeAttribute('checked');
      if (app.model.get(widget.id)){
        widget.setAttribute('checked', true);
      }
    });

    this.$('input:text.widget').each(function(index, widget){
      if ($(widget).hasClass('widget-number')){
        widget.value = app.formatNumber(app.model.get(widget.id));
      } else {
        widget.value = app.model.get(widget.id);
      }
    });

    this.$('textarea.widget').each(function(index, widget){
      widget.value = app.model.get(widget.id);
    });

    this.$('select.widget').each(function(index, widget){
      $(widget).find('option:selected').removeAttr('selected');
      $(widget.options).each(function(index, option){
        if(app.model.get(widget.id) === option.text){
          $(option).attr('selected', 'selected');
        }
      });
    });

    return this;
  },

  updateText: function(e){
    var attr = e.target.id;
    var widget = this.$el.find('#' + attr);
    var value = widget.val();
    this.model.set(attr, value);
  },

  updateNumber: function(e){
    var attr = e.target.id;
    var widget = this.$el.find('#' + attr);
    var value = this.unformatNumber(widget.val());
    this.model.set(attr, value);
  },

  updateFromOptions: function(e){
    var attr = e.target.id;
    var widget = this.$el.find('#' + attr);
    if(widget.is(':checkbox')){
      var value = widget.is(':checked');
      this.model.set(attr, value);
    } else if(widget.is('select')){
      // this would take the text of the option, not its value
      //
      // ie:
      // <select id="example">
      // <option value="1">Some text</option>
      // </select>
      //
      // model.get('example') would return "Some text", not "1"
      var value = this.$el.find('#' + attr + ' option:selected').text();
      this.model.set(attr, value);
    }
  },

  // TODO: extract format helpers

  formatNumber: function(value){
    if(value === null){
      return value;
    }
    return (value + '').replace('\.', '\,');
  },

  isNumber: function(field){
    // http://stackoverflow.com/a/1830844/854308
    return !isNaN(parseFloat(field)) && isFinite(field);
  },
  
  unformatNumber: function(value){
    var val = $.trim(value.replace('\,', '\.'));
    if(val === ''){
      val = null;
    } else if (this.isNumber(value)){
      val = +val;
    }
    return val;
  },
});
