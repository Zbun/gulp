(function() {
  var src = 'http://localhost:2015/imgs/downlink.jpg';

  function _isObject(tar) {
    return ({}).toString.call(tar).match(/object\s*(\w*)/)[1].toLowerCase() === 'object';
  }

  var _cookie = {
    get(key) {
      var cookie = document.cookie;
      if (!key || cookie.indexOf(key + '=') < 0) {
        return '';
      } else {
        return cookie.substr(cookie.indexOf(key + '=')).split('; ')[0].split('=')[1];
      }
    },
    set(key, value) {
      if (key && value) {
        document.cookie = key + '=' + value;
        return document.cookie;
      }
    }
  };

  function _analytic(_API) {
    var _kaT = [{
      dl: document.location.href
    }, {
      dr: document.referrer
    }, {
      dt: document.title
    }, {
      ua: navigator.userAgent
    }, {
      s: window.screen.width + 'x' + window.screen.height
    }];
    var tlid = '';
    if (localStorage) {
      tlid = localStorage['tlid'];
      if (!tlid) {
        tlid = localStorage['tlid'] = Math.random().toString().substr(2);
      }
    } else {
      tlid = _cookie.get('tlid');
      if (!tlid) {
        _cookie.set('tlid', new Date().getTime());
        tlid = _cookie.get('tlid');
      }
    }
    _kaT.push({ tlid: tlid });

    if (_ka && /array/i.test(({}).toString.call(_ka))) {
      _kaT = _kaT.concat(_ka);
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
    img.src = src;
  }
  _analytic(src);
})();
