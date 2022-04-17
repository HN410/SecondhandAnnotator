<template>
  <v-container>
    <v-row class="text-center">
        <v-btn-toggle v-model="toggleSelected" mandatory>
            <v-btn>ジャンル</v-btn>
            <v-btn>商品種別</v-btn>
            <v-btn>数量</v-btn>
            <v-btn>そのほか</v-btn>
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
  }
</script>
