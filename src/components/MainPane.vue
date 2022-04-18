<template>
  <v-container>
    <v-row><ToolPane v-bind:labelData="this.labelData" v-bind:pageMax="this.pageMax"
     ref="tool" v-on:changePage="changePage" v-on:changeTextData="changeTextData"></ToolPane></v-row>
    <v-row class="text-center">
      <v-col>
        <TextPane v-bind:text="this.textData[this.pageNumber-1]" v-bind:nowTag="this.tagSelected" 
         v-on:changeLabel="changeLabel" ref="text"></TextPane>
      </v-col>
      <v-col>
        <TogglePane v-bind:which="tagSelected"
        v-on:changeSelected="changeToggle"
        ref = "toggle"></TogglePane>
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
            tagSelected: 1, 
            pageNumber: 1, 
            pageMax: 2

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
        this.pageNumber = page;
        var self = this;
        this.$nextTick(() => {
          self.$refs.text.changePage();
        })
      }, 
      changeTextData: function(textData){
        this.textData = textData;
        this.pageMax = textData.length;
      }, 
      changeLabel: function(labelData){
        this.labelData = labelData;
      }
    }
  }
</script>
