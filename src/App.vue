<template>
  <v-app>
    <v-main>
      <MainPane ref="main"></MainPane>
    </v-main>
  </v-app>
</template>

<script>
import MainPane from './components/MainPane';

export default {
  name: 'App',

  components: {
    MainPane,
  },

  data: () => ({
    //
  }),
  mounted() {
    document.addEventListener('keydown', this.onKeydown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown);
  },

  methods: {
    onKeydown(event) {
      var code;
      switch(event.key){
        case "q":
          code = 0;
          break
        case 'a':
          code = 1;
          break;
        case 's':
          code = 2;
          break;
        case 'd':
          code = 3;
          break;
        case 'f':
          code = 4;
          break;
        case 'g':
          code = 5;
          break;
        case 'z':
          this.$refs.main.addPage(-1);
          return;
        case 'v':
          this.$refs.main.addPage(1);
          return;
        case `r`:
          this.$refs.main.reloadImage();
          return;
        default:
          return;
      }
      this.$refs.main.pushToggle(code);
    }
  }

};
</script>
