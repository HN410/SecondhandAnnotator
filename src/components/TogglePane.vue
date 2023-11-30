<template>
  <v-container>
    <v-row class="text-center" >
      <v-btn-toggle
        v-model="toggleSelected"
        v-on:change="changeSelected"
        mandatory
      >
        <v-col v-for="(item, index) in tagList" :key="index">
          <v-row>
            <v-col>
              <v-avatar v-if="toggleSelected==index" color="black" size= "10">  </v-avatar>
              <v-avatar v-if="toggleSelected!=index" color="white" size= "10">  </v-avatar>
            </v-col>
          </v-row>
          <v-row>
            <v-btn :color="getColor(index)" small height=50> {{ item }}</v-btn>
          </v-row>
        </v-col>
      </v-btn-toggle>
    </v-row>
  </v-container>
</template>

<script>
import Common from "./Common";
export default {
  name: "TogglePane",

  data: () => ({
    toggleSelected: undefined,
    tagList: Common.TAG_LIST,
  }),
  props: {
    which: Number,
  },

  methods: {
    changeSelected: function () {
      this.$emit("changeSelected", this.toggleSelected);
    },
    pushToggle: function (code) {
      this.toggleSelected = code;
      this.changeSelected();
    },
    getColor: function (index) {
      var color = Common.COLORS[index];
      if(index == 6){
        return color
      }else{
        return color + Common.COLOR_LIGHTEN+2;
      }
    },
  },
};
</script>
