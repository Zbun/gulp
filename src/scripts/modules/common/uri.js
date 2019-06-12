/**
 * URI操作，存取query及取hash
 * @author Zhao Liubin
 * @type {Object}
 */

module.exports = {
  query: {
    loc: window.location.href,
    get(key) {
      key = key.toLowerCase();
      var URISearch = window.location.search;
      if (!URISearch || !key || URISearch.toLocaleLowerCase().indexOf(key + '=') < 0) {
        return '';
      }
      var arrQuery = URISearch.split('?')[1].split('&'), l = arrQuery.length;
      while (l > 0) {
        var arrTemp = arrQuery[l - 1].split('=');
        if (arrTemp[0].toLocaleLowerCase() == key) {
          return arrTemp[1];
        }
        l--;
      }
      return '';
    },
    set(key, value) {
      var loc = this.loc;
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
    hash: window.location.hash,
    get() {
      var hash = this.hash;
      return hash.split('#')[1];
    },
    set(value) {
      if (value) {
        return window.location.hash = value;
      }
    }
  },
  origin() {
    if (location.origin) {
      return location.origin;
    } else {
      return window.location.protocol + "//" + window.location.host;
    }
  }
};