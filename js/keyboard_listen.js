// Called sometime after postMessage is called
var source;
var origin;

function receiveMessage(event) {
  // event.source is window.opener
  // event.data is "hello there!"

  // Assuming you've verified the origin of the received message (which
  // you must do in any case), a convenient idiom for replying to a
  // message isto call postMessage on event.source and provide
  // event.origin as the targetOrigin.
  source = event.source;
  origin = event.origin;
  event.source.postMessage("hi there yourself!  the secret response " +
    "is: rheeeeet!",
    event.origin);

}

window.addEventListener("message", receiveMessage, false);

$(function() {
  $('#message').click(function() {
    //source.postMessage("coucou", event.origin);
    var gui = require('nw.gui');
    var win = gui.Window.get();
    win.emit('tap',['a']);
  });
});