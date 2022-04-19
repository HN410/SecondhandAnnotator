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
    label: {}, // {タグ: {クリック: [テキスト]}}のディクショナリ
    selected: [], // どのインデックスがどの種のどのタグをつけているか [[ Tag, click], undefined, ...]など
    change: true,
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
    buttonLClicked(index) {
      this.buttonClicked(index, 0);
    },
    buttonRClicked(index) {
      // 数量以外
      if (this.nowTag != 3 && this.nowTag != 1) {
        this.buttonClicked(index, 2);
      }
    },
    addLabelAndSelected(index, click) {
      this.selected[index] = [this.nowTag, click];
      var text = this.text[index];
      if (this.nowTag in this.label) {
        if (click in this.label[this.nowTag]) {
          this.label[this.nowTag][click].push(text);
        } else {
          this.$set(this.label[this.nowTag], click, [text]);
        }
      } else {
        this.$set(this.label, this.nowTag, {});
        this.$set(this.label[this.nowTag], click, [text]);
        // this.label[this.nowTag] = {};
        // this.label[this.nowTag][click] =  [text];
      }
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
      this.change = true;
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
