<template>
  <v-container>
    <v-row class="text-center">
        <v-col><v-btn @click="previousPage"> &lt;&lt; [z]</v-btn></v-col>
        <v-col><v-text-field type="number" v-model="pageNumber" @change="changePage"></v-text-field></v-col>
        <v-col><v-btn @click="nextPage"> &gt;&gt; [v]</v-btn></v-col>
        <v-spacer></v-spacer>
        <v-col><v-btn>import</v-btn></v-col>
        <v-col><v-btn>save</v-btn></v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'ToolPane',

    data: () => ({
        pageNumber: 1,
        pageMax: 5,
      
    }),
    props: {
        "which": Number
    },

    
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
        }
    }
  }
</script>
