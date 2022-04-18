<template>
  <v-container>
    <v-row class="text-center">
        <v-col><v-btn @click="previousPage"> &lt;&lt; [z]</v-btn></v-col>
        <v-col><v-text-field type="number" v-model="pageNumber" @change="changePage"></v-text-field></v-col>
        <v-col><v-btn @click="nextPage"> &gt;&gt; [v]</v-btn></v-col>
        <v-spacer></v-spacer>
        <v-col><v-file-input
                  @change="onChangeFileInput"
                >テキストデータセット</v-file-input></v-col>
        <v-col><v-btn @click="download">save</v-btn></v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'ToolPane',

    data: () => ({
        pageNumber: 1,
        file_text: undefined
      
    }),
    props: ["labelData", "pageMax"],

    
    methods: {
        addPage: function(plus){
            this.pageNumber = this.pageNumber + plus;
            this.changePage();
        },
        nextPage: function(){
            this.addPage(1);
        }, 
        previousPage: function(){
            this.addPage(-1);
        },
        changePage: function(){
            if(this.pageNumber <= 0){
                this.pageNumber =1;
            }else if(this.pageNumber >= this.pageMax){
                this.pageNumber = this.pageMax;
            }
            this.$emit("changePage", this.pageNumber);
        },
        onChangeFileInput(file){
            var reader = new FileReader();
            reader.readAsText(file);
            var self = this;
            reader.onload = function(event){
                var result = event.target.result;
                var json = JSON.parse(result);
                self.$emit("changeTextData", json);
            }
        }, 
        download(){
            var str = JSON.stringify(this.labelData);
            var ary = str.split("");
            var blob = new Blob(ary,{type:"text/plan"}); 
            var link = document.createElement('a'); 
            link.href = URL.createObjectURL(blob); 
            link.download = 'data.json';
            link.click();
        }
    }
  }
</script>
