<template>
  <v-app >
    <v-banner
        v-if="deferredPrompt"
        color="info"
        dark
        class="text-left"
      >
        Get our free app. It won't take up space on your phone and also works offline!
        
        <template v-slot:actions>
          <v-btn text @click="dismiss">Dismiss</v-btn>
          <v-btn text @click="install">Install</v-btn>
        </template>
      </v-banner>

    <v-main class="d-flex align-center grey lighten-3">
      <v-container class="d-flex flex-row justify-center">
  
        <v-card class="pa-6">
           <v-img
      class="my-3"
      style="max-width: 300px;"
      contain
      src="./../assets/logo.png">
      

      </v-img>
      
      <v-text-field
            label="Email"
            outlined
            v-model="email"
          ></v-text-field>
          <v-text-field
            label="Senha"
            type="password"
            outlined
            v-model="password"
          ></v-text-field>

         

        <v-btn
          class="py-6"
          :loading="loading4"
          :disabled="loading4"
          color="accent"
          @click="exeLogin()"
          block
          
        >
          LOGAR
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
        </v-btn>

        </v-card>

      </v-container>
    </v-main>

    <v-dialog
      v-model="dialog"
      persistent
      max-width="500"
    >
      

      <v-card>
        <v-card-title class="headline grey lighten-2">
          <v-icon large class="mr-4">mdi-information</v-icon> Atenção! 
        </v-card-title>


        <v-card-text class="pa-8">
          
          {{login.msg}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="tt()"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> 

    

  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',

  components: {
  },
  beforeCreate(){
    const token = localStorage.getItem('token');
    if(token){
      this.$router.replace({name: 'Home'});
      return true;
    }
  },
  mounted(){
    
  },
  created(){
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });
  },
  data () {
      return {
        loader: null,
        loading4: false,
        dialog: false,
        loadingx: '',
        deferredPrompt: null,
        login: {
          msg: ''
        },
        email: 'leonardozaneladias@gmail.com',
        password: 'password'
      }
    },
    methods: {
      tt(){
        this.loading4 = false; 
        this.loader = null;
        this.dialog = false;
      },
      ti(){
        this.loading4 = true; 
        this.dialog = true;
      },
      async exeLogin(){

        this.loading4 = true;
        const vue = this;
        
        axios.post('http://localhost/api/sanctum/token', {
          email: this.email,
          password: this.password,
          device_name: "app"
        }).then(function (response) {
          localStorage.setItem('token', response.data);
          vue.$router.replace({name: 'Home'});

        })
        .catch(function (error) {
          vue.login.msg = error.response.data; 
          vue.ti();
          return false   
        });

        

        // if(res.status != 200){
           
        // }

        
      },
      async dismiss() {
        this.deferredPrompt = null;
      },
      async install() {
        this.deferredPrompt.prompt();
      }
    },
    watch: {
      
    }
};
</script>

<style scoped>
.custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
