<template>
  <v-container>
    <v-row><ToolPane v-bind:pageMax="this.pageMax" v-on:download="download" 
     ref="tool" v-on:changePage="changePage" 
     v-on:changeTextData="changeTextData"
     v-on:saveJson="saveJson"
     v-on:memoOutlier="memoOutlier"
     v-on:changeLabelData="changeLabelData"></ToolPane></v-row>
    <v-row class="text-center">
      <v-col>
        <TextPane v-bind:text="this.textData[this.pageNumber-1]" v-bind:nowTag="this.tagSelected" 
         v-on:changeLabel="changeLabel" ref="text" width="600"></TextPane>
        <v-row>
          <v-col><a v-bind:href="this.nowLink" 
                target="_blank" rel="noopener noreferrer">リンク</a></v-col>
        </v-row>
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
        <v-row>
          <v-spacer></v-spacer>
          <v-col>
            <v-img 
              contain
              lazy-src=""
              max-height = "350"
              max-width = "400"
              v-bind:src="this.nowImage">
            </v-img>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import TextPane from './TextPane';
  import TogglePane from './TogglePane';
  import ToolPane from './ToolPane';
  const DEFAULT_FILE_NAME = "data.json";
  
  export default {
    name: 'MainPane',

    data: () => ({
            textData: [[""], [""]], 
            imageData: ["", ""],
            nowImage: "",
            linkData: ["", ""],
            nowLink: "",
            labelData: {},
            fileName: "",
            labelDataSet: [{}, [], [], ""], // {ファイルパス: index}とラベルデータを格納
            outlierList: [], 
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
        this.reloadImage();
        this.reloadLink();
        this.$nextTick(() => {
          self.$refs.text.changePage();
        })
      }, 
      changeTextData: function(list){
        var textData = list[0][0];
        this.fileName = list[1];
        this.textData = textData;
        this.imageData = list[0][1];
        this.linkData = list[0][2];
        this.pageMax = textData.length;
        if(typeof this.labelDataSet[0] !== "undefined" && 
          this.fileName in this.labelDataSet[0])
        {
          this.$refs.tool.setNowPage(this.labelDataSet[0][this.fileName]);
        }else{
          this.$refs.tool.resetPage();
        }
        this.infoText = "Text data loading is finished.";
      }, 
      // 以前出力したデータセットの読み込み
      changeLabelData: function(labelDataSet){
        this.labelDataSet = labelDataSet;
        this.labelData = labelDataSet[1];
        this.outlierList = labelDataSet[2];
        var beforeFile = labelDataSet[3];
        this.$refs.text.setLabelData(this.labelData);
        if(this.fileName in this.labelDataSet[0]){
          this.$refs.tool.setNowPage(this.labelDataSet[0][this.fileName]);
        }
        if(beforeFile === ""){
          this.infoText = "Label data loading is finished.";
        }else{
          this.infoText = "The last checked file is \" " + beforeFile + "\"";
        }
      }, 
      changeLabel: function(labelData){
        this.labelData = labelData;
      }, 
      makeDownloadStr: function(){
        this.$refs.text.savePage();
        var self = this;
        this.$nextTick(() => {
          self.$refs.text.changePage();
        })
        this.labelDataSet[0][this.fileName] = this.$refs.tool.getNowPage();
        this.labelDataSet[1] = this.labelData;
        this.labelDataSet[2] = this.outlierList;
        this.labelDataSet[3] = this.fileName;
        var str = JSON.stringify(this.labelDataSet);
        return str;
      },
      download: function(){
        var str = this.makeDownloadStr();
        var ary = str.split("");
        var blob = new Blob(ary,{type:"text/plan"}); 
        var link = document.createElement('a'); 
        link.href = URL.createObjectURL(blob); 
        link.download = 'data.json';
        link.click();
      }, 
      // 後でデータ検査に使えそうなテキストを保存しておく
      memoOutlier: function(){
        var textList = this.textData[this.pageNumber - 1];
        this.outlierList.push(textList);
      },
      // アプリがあるフォルダのdata.jsonに保存
      saveJson: function(){
        var data = this.makeDownloadStr();
        console.log("ts");
        window.requires.writeData(DEFAULT_FILE_NAME, data);
      },
      reloadImage: function(){
        this.nowImage = this.imageData[this.pageNumber-1];
      }, 
      reloadLink: function(){
        this.nowLink = this.linkData[this.pageNumber-1];
      }
    }, 
  }
</script>
