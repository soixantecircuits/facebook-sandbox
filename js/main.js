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
  return false;
});

$('#postMessage').click(function(){
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
            console.error( response.error);
          } else {
            console.log('Post ID: ' + response.id);
          }
        });
      }
    });
  } else setTimeout(CheckLoginStatus, 1000);
}