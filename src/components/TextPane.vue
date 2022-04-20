<template>
  <v-container>
    <v-card class="pa-5" height="400">
      <v-spacer></v-spacer>
      <v-row v-if="change">
        <v-btn
          elevation="1"
          class="ma-1"
          style="text-transform: none"
          v-for="(item, index) in text"
          :key="index"
          @click.left.shift="buttonLShiftClicked(index)"
          @click.left.exact="buttonLClicked(index)"
          @click.right.exact="buttonRClicked(index)"
          @click.right.shift="buttonRShiftClicked(index)"
          :color="getColor(index)"
          :outlined="getOutlined(index)"
          >{{ item }}
        </v-btn>
      </v-row>
      <v-spacer></v-spacer>
    </v-card>
  </v-container>
</template>

<script>
import Common from "./Common";
export default {
  name: "TextPane",

  data: () => ({
    label: {}, // {タグ: {クリック: [[単語], 複数単語]}}のディクショナリ
                // 複数単語は，{"先頭単語", [[単語列], ]}のディクショナリ．ただし，単語列のリストはその長さで降順にソートされている
    selected: [], // どのインデックスがどの種のどのタグをつけているか [[ Tag, click, count], undefined, ...]など
    change: true,
    firstSelected: [], /// ページが切り替わった直後のselectedの状態, 
    extension : Common.EXTENSION
  }),
  props: ["text", "nowTag"],
  computed: {
    getColor() {
      var self = this;
      return function (index) {
        var selected = self.selected[index];
        if (typeof selected === "undefined") {
          return Common.COLOR_DEFAULT;
        } else {
          var color;
          if(selected[0] === Common.EXTENSION){
            // 別のものにたどり着くまで遡る
            var innerIndex = index;
            while(innerIndex > 0){
              --innerIndex;
              if(self.selected[innerIndex][0] !== Common.EXTENSION){
                color = Common.COLORS[self.selected[innerIndex][0]];
                break;
              }
            }
          }else{
            color = Common.COLORS[selected[0]];
          }
          if (selected[1] > 0) {
            color = color + Common.COLOR_LIGHTEN + selected[1] * 2;
          }
          return color;
        }
      };
    },
  },
  methods: {
    getOutlined(index){
      if( typeof this.selected[index] === "undefined" ){
        return false;
      }else{
        return this.selected[index][0] === this.extension
      }
    },
    selectedCopy(selected){
        // 二次元配列のディープコピー
        var ans = [];
        for(var index = 0; index < selected.length; ++index){
            if(typeof selected[index] !== "undefined"){
                ans[index] = Array.from(selected[index]);
            }
        }
        return ans;
    },
    buttonLClicked(index) {
      this.buttonClicked(index, 0, false);
    },
    buttonLShiftClicked(index) {
      this.buttonClicked(index, 0, true);
    },
    buttonRClicked(index) {
      // 数量以外
      if (this.nowTag != 3 && this.nowTag != 1) {
        this.buttonClicked(index, 2, false);
      }
    },
    buttonRShiftClicked(index) {
      // 数量以外
      if (this.nowTag != 3 && this.nowTag != 1) {
        this.buttonClicked(index, 2, true);
      }
    },
    addLabel(index, tag, click, count){
        // 使うことになる新しい変数を作っておく
        var text = this.text[index];
        var texts = this.text.slice(index, index + count);
        var newAns = count > 1 ? {[text]: [texts]} : [text];
        var newList = [[], {}];
        var ansInd = count > 1 ? 1 : 0;
        newList[ansInd] = newAns;

        if (tag in this.label) {
            // このタグ初ではない
            if (click in this.label[tag]) {
                // クリック種も既にやった
                if(count > 1){
                    // このとき必ずソートも行う
                    // 長さが長いものほど先に来るように
                    var list = this.label[tag][click][1][text];
                    if(typeof list === "undefined"){
                      this.label[tag][click][1][text] = [texts];
                      list = this.label[tag][click][1][text];
                    }
                    list.push(texts);    
                    list.sort((a,b) => b.length - a.length);
                }else{
                    this.label[tag][click][0].push(text);
                }
            } else {
                this.$set(this.label[tag], click, newList);
            }
        } else {
            this.$set(this.label, tag, {});
            this.$set(this.label[tag], click, newList);
        }
    },
    addSelected(index, click, shift) {
      if(!shift){
        this.selected[index] = [this.nowTag, click, 1];
      }else{
        var nowCount = this.selected[index][2];
        if(index + nowCount < this.text.length && typeof this.selected[index + nowCount] === "undefined"){
          this.selected[index] = [this.nowTag, click, nowCount + 1];
          this.selected[index + nowCount] = [Common.EXTENSION, 0, 1];
        }
      }
    },
    deleteSelected(index){
      var count = this.selected[index][2];
      for(var step = 0; step < count; ++step){
        this.selected[index+step] = void 0;
      }
    },
    buttonClicked(index, click, shift) { //ctrlclickを追加
      this.change = false;
      if (typeof this.selected[index] === "undefined") {
        // タグなし
        this.addSelected(index, click, false);
      } else {
        // すでになにかは登録済み
        if(this.selected[index][0] == this.nowTag && 
          this.selected[index][1] == click) {
            if(shift){
              // 追加
              this.addSelected(index, click, true);
            }else{
              // 削除
              this.deleteSelected(index);
            }
        }else if(this.selected[index][0] !== Common.EXTENSION){
            // EXTENSION以外を選択したなら上書き
            // 語の場合もあるので一度消す
            this.deleteSelected(index);
            this.addSelected(index, click, false);
        }
      }
      this.change = true;
    },
    changeLabel: function () {
      this.$emit("changeLabel", this.label);
    },
    // changePageで，辞書内の語との最長一致があるか調べる, なければundefined
    checkWordMatch: function(index, firstKey, secondKey){
      var innerCheckList = this.label[firstKey][secondKey][1][this.text[index]];
      for(var forthKeyInd = 0; forthKeyInd < innerCheckList.length; ++forthKeyInd){
        // 各単語についてすべて一致するか調べる
        var nowTag = innerCheckList[forthKeyInd];
        if(nowTag.length + index > this.text.length){
          // 長さがはみ出てしまうのでありえない
          continue;
        }
        var matched = true;
        for(var tagInd = 0; tagInd < nowTag.length; ++tagInd){
          if(this.text[index + tagInd] !== nowTag[tagInd]){
            matched = false;
            break;
          }
        }
        if(matched){
          // firstKey, secondKeyの中では最長のものが見つかったので，ほかのkeyで
          // より長いものがあるか探す
          var maxTag = [firstKey, secondKey, nowTag.length];
          var maxLen = nowTag.length;
          return [maxTag, maxLen];
        }
      }
      return void 0;
    },
    // ページ変更時，すでに辞書にあるデータをもとにラベル付けする
    changePage: function () { 
      this.change = false;
      this.selected = [];
      // 各単語にタグを割り当てる
      var index = 0;
      while(index < this.text.length){
        var firstKeys = Object.keys(this.label);
        var maxLen = 0; // 一致した最長列
        var maxTag = undefined; // その時のタグ
        for (
          var firstKeyInd = 0;
          firstKeyInd < firstKeys.length;
          ++firstKeyInd
        ) {
            var firstKey = firstKeys[firstKeyInd];
          var secondKeys = Object.keys(this.label[firstKey]);
          for (
              var secondKeyInd = 0;
            secondKeyInd < secondKeys.length;
            ++secondKeyInd
          ) {
            var secondKey = secondKeys[secondKeyInd];
            for(var thirdKeyInd = 1; thirdKeyInd >= 0; --thirdKeyInd){
              if( thirdKeyInd == 0 && maxLen > 0){
                //すでに何かしら候補があったら単語からは探さず，語からのみ探す
                continue;
              }
              var checkList = this.label[firstKey][secondKey];
              if(thirdKeyInd == 0){
                checkList = checkList[0];
              }else{
                checkList = Object.keys(checkList[1]);
              }
              if(checkList.includes(this.text[index])) {
                  // 該当箇所あり
                  if(thirdKeyInd == 0){
                    // 単語の場合
                    maxTag = [firstKey, secondKey, 1];
                    maxLen = 1;
                  }else{
                    // 語の場合
                    var ans = this.checkWordMatch(index, firstKey, secondKey);
                    if(typeof ans !== "undefined"){
                      maxTag = ans[0];
                      maxLen = ans[1];
                    }
                  }
              }
            }
          }
            
        }
        if(maxLen > 0){
          // 何かしら見つかった
          // 埋めていく
          this.selected[index] = maxTag;
          for(var count = 1; count < maxLen; ++count){
            this.selected[index + count] = [Common.EXTENSION, 0, 1]; 
          }
          index = index + maxLen;
        }else{
          ++index;
        }
      }
      this.firstSelected = this.selectedCopy(this.selected);
      this.change = true;
    },
    // savePageでタグを追加するかと消去するかを判断
    judgeAddRemove: function(firstUnit, nowUnit){
      var doRemove = false;
      var doAdd = false;
      if(typeof firstUnit === "undefined"){
          // 単純な追加
          doAdd = true;
      }else{
          // 前回に何かある
          if(firstUnit[0] === Common.EXTENSION){
            // 前は語の後ろ部分なので削除しなくてよい
            if(typeof nowUnit !== "undefined"){
              doAdd = true;
            }
          }else{
            if(typeof nowUnit === "undefined"){
                // 削除のみ
                doRemove = true;
            }else if(nowUnit[2] > 1){
              // 語の追加 削除ナシ
                doAdd = true;
            }else{
              // 単語の追加 削除する
              doRemove = true;
              doAdd = true;
            }
          }
      }
      return [doAdd, doRemove];
    },
    savePage: function(){
        // ページを変える前に呼び出し，内容をセーブする
        var len = Math.max(this.firstSelected.length, this.selected.length);
        var index = 0;
        while(index < len){
            // 二単語以上を登録している場合，indexが一気に進む
            var firstUnit = this.firstSelected[index];
            var nowUnit = this.selected[index];
            if(!Common.arrayEqual(nowUnit, firstUnit)){
                // 違うのでそれを反映
                var doAddRemove = this.judgeAddRemove(firstUnit, nowUnit);
                var doAdd = doAddRemove[0];
                var doRemove = doAddRemove[1];
                if(doRemove){
                  // データ削除 
                  var filtered = this.label[firstUnit[0]][firstUnit[1]];
                  if(firstUnit[2] > 1){
                    // 語のとき
                    var removeIndex = this.text[index];
                    var removee = this.text.slice(index, index + firstUnit[2]);
                    filtered[1][removeIndex] = filtered[1][removeIndex].filter((item) => !Common.arrayEqual(item, removee));
                  }else{
                    // 単語のとき
                    filtered[0] = filtered[0].filter((item) => item !== this.text[index]);
                  }
                }
                if(doAdd){
                  // 追加
                  this.addLabel(index, nowUnit[0], nowUnit[1], nowUnit[2]);
                  index = index + nowUnit[2] -1; //複数単語の場合indexをさらに追加
                }
            }
            ++index;
        }
        this.changeLabel();
    },
    setLabelData(labelData){
      this.label = labelData;
    }, 
    getLabelData(){
      return this.label;
    }
  },
};
</script>
