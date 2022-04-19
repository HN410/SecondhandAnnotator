const COLOR_LIGHTEN = " lighten-"
const COLORS = ["blue", "green", "brown", "red", "orange"];
const COLOR_DEFAULT = "grey lighten-5";
const TAG_LIST = ["ジャンル [a]","無関係[s]", "商品種別 [d]", "数量 [f]", "そのほか [g]", ];

function arrayEqual(a, b) {
    if (!Array.isArray(a))    return false;
    if (!Array.isArray(b))    return false;
    if (a.length != b.length) return false;
    for (var i = 0, n = a.length; i < n; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
}
export default{
    COLOR_LIGHTEN, COLOR_DEFAULT, COLORS, TAG_LIST, arrayEqual
}