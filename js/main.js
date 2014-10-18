var signinWin,
  URL = 'https://graph.facebook.com/oauth/authorize?client_id=244306102422798&redirect_uri=https://www.facebook.com/connect/login_success.html&display=popup&response_type=token&scope=publish_stream',
  popUpWidth = 500,
  popUpHeight = 300,
  token = '';

var FB = require('fb');

$('#FacebookBtn').click(function() {
  var pos = {
    x: $(window).width() / 2 - popUpWidth / 2,
    y: $(window).height() / 2 - popUpHeight / 2
  };
  signinWin = window.open(URL, "SignIn", "width=" + popUpWidth + ",height=" + popUpHeight + ",toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0,left=" + pos.x + ",top=" + pos.y);
  setTimeout(CheckLoginStatus, 2000);
  signinWin.focus();
  win = gui.Window.open('keyboard.html', {
    width: window.screen.width,
    height: 200
  });

  win.on("tap", function(data) {
    signinWin.document.getElementById('email').value += data;
    signinWin.document.getElementById('pass').value += data;
    
    //if(enter)
      document.getElementById("login_form").submit();
  });

  win.moveTo(0, Number(window.screen.height - 200))
  win.setAlwaysOnTop(true);
  return false;
});


var key;

function receiveMessage(event) {
  // Do we trust the sender of this message?  (might be
  // different from what we originally opened, for example).
  //if (event.origin !== "http://example.org")
  //  return;

  // event.source is popup
  // event.data is "hi there yourself!  the secret response is: rheeeeet!"
  alert(event.source);
  alert(event.data);
}
window.addEventListener("message", receiveMessage, false);
createKeyboard = function() {
  key = window.open('keyboard.html', "keyboard", "width=" + window.screen.width + ",height=" + 200 + ",toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0,screenX=0,screenY=" + Number(window.screen.height - 200));

  key.postMessage("hello there!", window.location.origin);
}
//createKeyboard();


FB.api('oauth/access_token', {
  client_id: '853932834639493',
  client_secret: '2a81a4f3e17b87c6bd11c9ebd981793f',
  grant_type: 'client_credentials'
}, function(res) {
  if (!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }

  var accessToken = res.access_token;
  FB.setAccessToken(token);
});

$('#postMessage').click(function() {
  var body = 'Happy';
  FB.api('me/feed', 'post', {
    message: body,
    picture: 'http://farm4.staticflickr.com/3332/3451193407_b7f047f4b4_o.jpg'
  }, function(res) {
    if (!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    }
    console.log('Post Id: ' + res.id);
  });
});

var gui = require('nw.gui');
var win;


function CheckLoginStatus() {
  if (signinWin.location.href.indexOf("https://www.facebook.com/connect/login_success.html") != -1) {
    var param = $.deparam(signinWin.location.href);
    token = param['https://www.facebook.com/connect/login_success.html#access_token']
    FB.setAccessToken(token);
    FB.api('/me', function(response) {
      console.log('Good to see you, ' + response.name + '.');
    });

    var album_details = {
      message: "Great moment",
      name: "Hapiness"
    };

    FB.api('/me/albums', 'post', album_details, function(response) {
      if (!response || response.error) {
        console.error('Error occured:');
        console.error(response.error);
      } else {
        var imgURL = "http://farm4.staticflickr.com/3332/3451193407_b7f047f4b4_o.jpg";
        FB.api('/' + response.id + '/photos', 'post', {
          message: 'photo description',
          url: imgURL
        }, function(response) {
          if (!response || response.error) {
            console.error('Error occured: ')
            console.error(response.error);
          } else {
            console.log('Post ID: ' + response.id);
          }
        });
      }
    });
  } else setTimeout(CheckLoginStatus, 1000);
}