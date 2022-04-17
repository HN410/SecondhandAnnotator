<template>
  <v-container>
      <v-card class="pa-5" height=400>
        <v-spacer></v-spacer>
        <v-row>
            <v-btn-toggle  v-for="(item, index) in text" :key="index">
                <v-btn elevation="1" class="ma-1" @click="buttonClicked(index)">{{item}}</v-btn>
            </v-btn-toggle>
        </v-row>
        <v-spacer></v-spacer>
      </v-card>
  </v-container>
</template>

<script>
  export default {
    name: 'TextPane',

    data: () => ({
        label: {}, 
      
    }),
    props: ["text", "nowTag"],
    methods: {
        buttonClicked: function(index){
            if(index in this.label){
                this.label[this.nowTag] = 
                    this.label[this.nowTag].filter(item => item != this.text[index]);
            }else{
                this.label[this.nowTag].push(this.text[index]);
            }
            this.changeLabel();
        }, 
        changeLabel: function(){
            
        }
    }
  }
</script>
