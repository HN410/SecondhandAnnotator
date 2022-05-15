const COLOR_LIGHTEN = " lighten-"
const COLORS = ["purple", "blue", "green", "brown", "red", "orange"];
const COLOR_DEFAULT = "grey lighten-5";
const TAG_LIST = ["弱ジャンル [q]", "ジャンル [a]","無関係[s]", "商品種別 [d]", "数量 [f]", "その他 [g]", ];
const EXTENSION = -1;
function arrayEqual(a, b) {
    if (a === void 0){
      if (b === void 0)    return true;
      return false;
    } 
    if (b === void 0)    return false;
    if (a.length != b.length) return false;
    for (var i = 0, n = a.length; i < n; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
}
export default{
    COLOR_LIGHTEN, COLOR_DEFAULT, COLORS, TAG_LIST, arrayEqual, EXTENSION
}