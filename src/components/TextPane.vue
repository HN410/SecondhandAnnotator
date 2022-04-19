<template>
  <v-container>
    <v-card class="pa-5" height="400">
      <v-spacer></v-spacer>
      <v-row v-if="change">
        <v-btn
          elevation="1"
          class="ma-1"
          v-for="(item, index) in text"
          :key="index"
          @click.left="buttonLClicked(index)"
          @click.right="buttonRClicked(index)"
          :color="getColor(index)"
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
                // 複数単語は，{"先頭単語", [[単語列], ]}のディクショナリ
    selected: [], // どのインデックスがどの種のどのタグをつけているか [[ Tag, click], undefined, ...]など
    change: true,
    firstSelected: [], /// ページが切り替わった直後のselectedの状態
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
          var color = Common.COLORS[selected[0]];
          if (selected[1] > 0) {
            color = color + Common.COLOR_LIGHTEN + selected[1] * 2;
          }
          return color;
        }
      };
    },
  },
  methods: {
    selectedCopy(selected){
        // 二次元配列のディープコピー
        var ans = [];
        for(var index = 0; index < selected.length; ++index){
            if(typeof selected[index] !== "undefined"){
                ans[index] == Array.from(selected[index]);
            }
        }
        return ans;
    },
    buttonLClicked(index) {
      this.buttonClicked(index, 0);
    },
    buttonRClicked(index) {
      // 数量以外
      if (this.nowTag != 3 && this.nowTag != 1) {
        this.buttonClicked(index, 2);
      }
    },
    addLabel(index, click, tag, count){
        // 使うことになる新しい変数を作っておく
        var text = this.text[index];
        var texts = this.text.slice(index, index + count);
        var newAns = count > 1 ? {[text]: texts} : [text];
        var newList = [　, ];
        var ansInd = count > 1 ? 1 : 0;
        newList[ansInd] = newAns;

        if (tag in this.label) {
            // このタグ初ではない
            if (click in this.label[tag]) {
                // クリック種も既にやった
                if(count > 1){
                    this.label[this.nowTag][click][1][text].push(texts);    
                }else{
                    this.label[this.nowTag][click][0].push(text);
                }
            } else {
                this.$set(this.label[this.nowTag], click, newList);
            }
        } else {
            this.$set(this.label, tag, {});
            this.$set(this.label[tag], click, newList);
        }
    },
    addLabelAndSelected(index, click) {
      this.selected[index] = [this.nowTag, click];
      
      
    },
    buttonClicked: function (index, click) {
      this.change = false;
      if (typeof this.selected[index] === "undefined") {
        // タグなし
        this.addLabelAndSelected(index, click);
      } else {
        // すでになにかは登録済み
        var removeTag = this.nowTag;
        var removeClick = click;
        if (
          !(
            this.selected[index][0] == this.nowTag &&
            this.selected[index][1] == click
          )
        ) {
          // 異なる状態なので前のタグを消してから追加
          removeTag = this.selected[index][0];
          removeClick = this.selected[index][1];
          this.addLabelAndSelected(index, click);
        } else {
          this.selected[index] = void 0;
        }
        // データ削除
        this.label[removeTag][removeClick] = this.label[removeTag][
          removeClick
        ].filter((item) => item != this.text[index]);
      }
      this.change = true;
      this.changeLabel();
    },
    changeLabel: function () {
      this.$emit("changeLabel", this.label);
    },

    changePage: function () {
      this.change = false;
      this.selected = [];
      // 各単語にタグを割り当てる
      for (var index = 0; index < this.text.length; ++index) {
        var firstKeys = Object.keys(this.label);
        outer_block: {
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
                var checkList = this.label[firstKey][secondKey];
                if(checkList.includes(this.text[index])) {
                    // 該当箇所あり
                    this.selected[index] = [firstKey, secondKey];
                    break outer_block;
                }
              }
            }
        }
      }
      this.firstSelected = this.selectedCopy(this.selected);
      this.change = true;
    },
    pageSave: function(){
        // ページを変える時に呼び出し，内容をセーブする
        var len = Math.max(this.firstSelected.length, this.selected.length);
        var index = 0;
        while(index < len){
            // 二単語以上を登録している場合，indexが一気に進む
            if(!Common.arrayEqual(this.selected[index], this.firstSelected[index])){
                // 違うのでそれを反映
                if(typeof this.firstSelected[index] === "undefined"){
                    // 単純な追加
                }else{
                    if(typeof this.selected[index] === "undefined"){
                        // 削除のみ
                    }else{

                    }

                }
            }
            ++index;
        }
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
