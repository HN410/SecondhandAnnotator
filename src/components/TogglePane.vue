<template>
  <v-container>
    <v-row class="text-center">
        <v-btn-toggle v-model="toggleSelected" 
        v-on:change="changeSelected" mandatory>
            <v-btn ref = "b0">ジャンル [a]</v-btn>
            <v-btn ref = "b1">商品種別 [s]</v-btn>
            <v-btn ref = "b2">数量 [d]</v-btn>
            <v-btn ref = "b3">そのほか [f]</v-btn>
        </v-btn-toggle>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'TogglePane',

    data: () => ({
        "toggleSelected": undefined,
      
    }),
    props: {
        "which": Number
    },

    
    methods: {
        changeSelected: function(){
            this.$emit("changeSelected", this.toggleSelected);
        }, 
        pushToggle: function(code){
           this.toggleSelected = code;
           this.changeSelected();
        }
    }
  }
</script>
