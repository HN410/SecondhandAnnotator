<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <TextPane v-bind:val="textData"></TextPane>
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
  export default {
    name: 'MainPane',

    data: () => ({
            textData: "test", 
            tagSelected: 1
    }),

    components: {
      TextPane,
      TogglePane
    },
    methods: {
      changeToggle: function(selected){
        this.tagSelected = selected;
      }, 
      pushToggle: function(code){
        this.$refs.toggle.pushToggle(code);
      }
    }
  }
</script>
