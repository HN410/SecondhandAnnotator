<template>
  <v-container>
    <v-row class="text-center">
        <v-btn>{{val}}</v-btn>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'TextPane',

    data: () => ({
      
    }),
    props: ["val"],
  }
</script>
