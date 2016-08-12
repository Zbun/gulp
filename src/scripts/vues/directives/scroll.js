import ScrollList from 'scrollList';

export default {
  bind () {
   ScrollList($(this.el), {line:1,speed:500,timer:2000});
  }
}