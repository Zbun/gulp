/**
 * URI操作，存取query及取hash
 * @author Zhao Liubin
 * @type {Object}
 */

module.exports = {
  query: {
    locTop: top.window.location.href,
    loc: window.location.href,
    get(key, top) {
      key = key.toLowerCase();
      var loc = this.loc;
      if (top === 'top') {
        loc = this.locTop;
      }
      if (!key || loc.toLocaleLowerCase().indexOf(key + '=') < 0) {
        return '';
      }
      loc = loc.split('#')[0];
      var arrQuery = loc.split('?')[1].split('&'), l = arrQuery.length;
      while (l > 0) {
        var arrTemp = arrQuery[l - 1].split('=');
        if (arrTemp[0].toLocaleLowerCase() == key) {
          return arrTemp[1];
        }
        l--;
      }
      return '';
    },
    set(key, value, top) {
      var loc = this.loc;
      if (top === 'top') {
        loc = this.locTop;
      }
      if (!key || !value) {
        return loc;
      }
      if (value) {
        var query = this.get(key);
        if (query) {
          return loc.replace(this.get(key), value);
        } else {
          var arrTemp = loc.split('#'),
            newURL;
          newURL = arrTemp[0] + '&' + key + '=' + value;
          if (arrTemp[1]) {
            newURL += '#' + arrTemp[1];
          }
          return newURL;
        }
      }
    }
  },
  hash: {
    hashTop: top.window.location.hash,
    hash: window.location.hash,
    get(top) {
      var hash = this.hash;
      if (top === 'top') {
        hash = this.hashTop;
      }
      return hash.split('#')[1];
    },
    set(value, top) {
      if (value) {
        if (top === 'top') {
          return top.window.location.hash = value;
        }
        return window.location.hash = value;
      }
    }
  },
  origin() {
    if (location.origin) {
      return location.origin;
    } else {
      return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }
  }
};