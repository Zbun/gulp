(function() {
  var src = 'http://localhost:2015/imgs/downlink.jpg';

  function _isObject(tar) {
    return ({}).toString.call(tar).match(/object\s*(\w*)/)[1].toLowerCase() === 'object';
  }

  var _cookie = {
    get: function(key) {
      var cookie = document.cookie;
      if (!key || cookie.indexOf(key + '=') < 0) {
        return '';
      } else {
        return cookie.substr(cookie.indexOf(key + '=')).split('; ')[0].split('=')[1];
      }
    },
    set: function(key, value) {
      if (key && value) {
        document.cookie = key + '=' + value;
        return value;
      }
    }
  };

  function _analytic(_API) {
    var _kaT = [{
      dl: document.location.href,
      dr: document.referrer,
      dt: document.title,
      ua: window.navigator.userAgent,
      s: window.screen.width + 'x' + window.screen.height
    }];
    var tlid = '';
    if (window.localStorage) {
      tlid = localStorage['tlid'];
      if (!tlid) {
        tlid = localStorage['tlid'] = Math.random().toString().substr(2);
      }
    } else {
      tlid = _cookie.get('tlid');
      if (!tlid) {
        tlid = _cookie.set('tlid', new Date().getTime());
      }
    }
    _kaT.push({ tlid: tlid });

    if (window._ka) {
      if (_isObject(window._ka)) {
        _kaT.push(window._ka);
      } else if (/array/i.test(({}).toString.call(window._ka))) {
        _kaT = _kaT.concat(window._ka);
      }
    }

    src = (_API || src) + '?rid=' + Math.random().toString().substr(2);
    var i = 0,
      l = _kaT.length;
    for (; i < l; i++) {
      if (_isObject(_kaT[i])) {
        Object.keys(_kaT[i]).forEach(function(el) {
          src += '&' + el + '=' + _kaT[i][el];
        });
      }
    }
    var img = document.createElement('img');
    img.src = window.encodeURI(src);
  }
  _analytic(src);
})();
