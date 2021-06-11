<template>
  <v-app>
    <v-app-bar app
      color="blue accent-4"
      dark
      fixed
    >
      
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
       
       >
       </v-app-bar-nav-icon>

      <v-toolbar-title>{{title}}</v-toolbar-title>

      <v-spacer></v-spacer>
      
    </v-app-bar>

    <v-navigation-drawer  
      v-model="drawer"
      fixed
      top
      temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            PETX
          </v-list-item-title>
          <v-list-item-subtitle>
            Leonardo Zanela
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content @click="navTo(item.route)">
                  <v-list-item-title >{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        

        <v-list-item
          link
        >
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content @click="logout()">
                  <v-list-item-title >Sair</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  <v-main>
    <slot></slot>
  </v-main>
  </v-app>
</template>

<script>
  export default {
  created () {
     
      this.title = this.$router.currentRoute.meta.title;
      document.title = this.$router.currentRoute.meta.title;
  },
    data: () => ({
      drawer: false,
      items: [
          { title: 'Home', icon: 'mdi-view-dashboard', route: 'Home' },
          { title: 'Agendamentos', icon: 'mdi-help-box', route: 'Agendamentos' },
          { title: 'Serviços', icon: 'mdi-help-box', route: 'ListServices' },
          { title: 'Meus Pets', icon: 'mdi-help-box', route: 'MeusPets' },
        ],
        right: null,
        title: 'Home'
    }),
    methods: {
        navTo(link){
            this.$router.replace({name: link})
        },
        logout(){
            localStorage.removeItem('token');
            this.$router.replace({name: 'Login'})
        }
    }
    
  }
</script>

<style>

</style>