# Modals

See https://github.com/twbs/bootstrap/issues/17732

Bootstrap adds the modal to the DOM every time modal('toggle') is called.
But, on close, do not remove the window from the DOM, only hides it. That creates "zombie window modals" that listen and react to events, which may have unintended consequences.

The way to use bootstrap modals to avoid this kind of problems is:

- append it to the DOM dinamically
- connect components and events
- remove it from the DOM after it is hidden

For example:

<pre><code>

    // add modal to DOM
    var node = $(document.body).append($('#modal-tmpl').html());

    // take it from DOM and connect events, fill components, etc
    var modalEl = $('#editInfoModal');
    var modalViews = [];

    var select = new Backbone.UILib.SelectView({
      el: $('#modal #select'),
      collection: domains,
      }).render();
    modalViews.push(select);

    var widgetsView = new Backbone.UILib.WidgetsView({
      el: modalEl,
      model: this.model
    }).render();
    modalViews.push(widgetsView);

    // remove modal from DOM on hide
    modalEl.on('hidden.bs.modal', function () {
      $(this).remove();
      _.invoke(modalViews, 'remove');
      modalViews = [];
    });

    // do open the modal
    modalEl.modal('show');

</pre></code>
