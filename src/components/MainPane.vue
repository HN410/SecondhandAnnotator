<template>
  <v-container>
    <v-row><ToolPane v-bind:pageMax="this.pageMax" v-on:download="download"
     ref="tool" v-on:changePage="changePage" 
     v-on:changeTextData="changeTextData"
     v-on:changeLabelData="changeLabelData"></ToolPane></v-row>
    <v-row class="text-center">
      <v-col>
        <TextPane v-bind:text="this.textData[this.pageNumber-1]" v-bind:nowTag="this.tagSelected" 
         v-on:changeLabel="changeLabel" ref="text" width="600"></TextPane>
      </v-col>
      <v-col>
        <v-row>
          <TogglePane v-bind:which="tagSelected"
          v-on:changeSelected="changeToggle"
          ref = "toggle"></TogglePane>
        </v-row>
        <v-row>
          <v-text-field readonly :value="infoText"></v-text-field>

        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import TextPane from './TextPane';
  import TogglePane from './TogglePane';
  import ToolPane from './ToolPane';
  export default {
    name: 'MainPane',

    data: () => ({
            textData: [["test", "yes", "ahh"], ["aaa", "dasd", "asda"]], 
            labelData: {},
            fileName: "",
            labelDataSet: [{}, []], // {ファイルパス: index}とラベルデータを格納
            tagSelected: 1, 
            pageNumber: 1, 
            pageMax: 2, 
            infoText: "Information", 
            pressedCtrl: false

    }),

    components: {
      TextPane,
      TogglePane, 
      ToolPane
    },
    methods: {
      changeToggle: function(selected){
        this.tagSelected = selected;
      }, 
      pushToggle: function(code){
        this.$refs.toggle.pushToggle(code);
      }, 
      addPage: function(plus){
        this.$refs.tool.addPage(plus);
      }, 
      changeNowTag: function(tag){
        this.nowTag = tag;
      }, 
      changePage: function(page){
        this.$refs.text.savePage();
        this.pageNumber = page;
        var self = this;
        this.$nextTick(() => {
          self.$refs.text.changePage();
        })
      }, 
      changeTextData: function(list){
        var textData = list[0];
        this.fileName = list[1];
        this.textData = textData;
        this.pageMax = textData.length;
        if(typeof this.labelDataSet[0] !== "undefined" && 
          this.fileName in this.labelDataSet[0])
        {
          this.$refs.tool.setNowPage(this.labelDataSet[0][this.fileName]);
        }
        this.infoText = "TextData loading is finished.";
      }, 
      // 以前出力したデータセットの読み込み
      changeLabelData: function(labelDataSet){
        this.labelDataSet = labelDataSet;
        this.labelData = labelDataSet[1];
        this.$refs.text.setLabelData(this.labelData);
        if(this.fileName in this.labelDataSet[0]){
          this.$refs.tool.setNowPage(this.labelDataSet[0][this.fileName]);
        }

      }, 
      changeLabel: function(labelData){
        this.labelData = labelData;
      }, 
      download: function(){
        this.$refs.text.savePage();
        this.$nextTick(() => {
          self.$refs.text.changePage();
        })
        this.labelDataSet[0][this.fileName] = this.$refs.tool.getNowPage();
        this.labelDataSet[1] = this.labelData;
        var str = JSON.stringify(this.labelDataSet);
        var ary = str.split("");
        var blob = new Blob(ary,{type:"text/plan"}); 
        var link = document.createElement('a'); 
        link.href = URL.createObjectURL(blob); 
        link.download = 'data.json';
        link.click();
      }
    }, 
  }
</script>
