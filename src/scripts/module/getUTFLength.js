module.exports = (function() {
  // String.prototype.getUTFLength = function() {
  //   return this.replace(/[\u4E00-\u9FA5]/g, 'zz').length;
  // }

  Object.defineProperty(String.prototype, 'UTFlength', { get: function() {
      return this.replace(/[\u4E00-\u9FA5]/g, 'zz').length; } })
})()
