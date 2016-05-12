/*获取目标类型方法*/

module.exports = (target) => {
    try {
        return Object.prototype.toString.call(target).match(/object\s*(\w*)/)[1].toLowerCase();
    } catch (e) {
        console.wran(e);
    }
}
