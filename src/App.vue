<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

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
    document.addEventListener('keydown', this.onKeydown)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown)
  },

  methods: {
    onKeydown(event) {
      var code;
      switch(event.key){
        case 'a':
          code = 0;
          break;
        case 's':
          code = 1;
          break;
        case 'd':
          code = 2;
          break;
        case 'f':
          code = 3;
          break;
        case 'g':
          code = 4;
          break;
        case 'z':
          this.$refs.main.addPage(-1);
          return;
        case 'v':
          this.$refs.main.addPage(1);
          return;
        default:
          return;
      }
      this.$refs.main.pushToggle(code);
    }
  }

};
</script>
