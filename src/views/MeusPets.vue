<template>
  <layout>    
    <v-container :fluid="true">

            <v-dialog
              v-model="loader"
              hide-overlay
              persistent
              width="300"
            >
              <v-card
                color="primary"
                dark
              >
                <v-card-text>
                  Carregando dados
                  <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>

            <template v-if="pets.length">

              <v-card
                
                elevation="2"
                v-for="item in pets"
                class="mx-auto my-2"
                outlined
                :key="item.id"
                v-on:click="toPet(item)"
                
              >
                <v-list-item three-line >
                  <v-list-item-content>
                    <div class="overline mb-4">
                     {{item.breed.name}}
                    </div>
                    <v-list-item-title class="headline mb-1">
                      {{item.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      22/01/2018
                    </v-list-item-subtitle>
                    
                  </v-list-item-content>
                  

                  <v-list-item-avatar
                    size="80"
                    color="grey"
                  >
                   <img
                    :src="`http://localhost/storage/uploads/pets/${item.image}`"
                    alt=""
                  >
                  </v-list-item-avatar>
                  
                  
                </v-list-item>
                <v-divider></v-divider>
               
              </v-card>


            </template>
            <template v-if="!pets.length && !loader">

              <v-card>
                <v-card-text>
                  <v-icon
                    large
                    color="grey darken-2"
                  >
                      mdi-alert-circle-outline
                  </v-icon>
                  Nenhum Pet cadastrado até o momento
                </v-card-text>
              </v-card>

            </template>
              
            <v-btn
              color="blue"
              fab
              dark
              bottom
              right
              fixed
              to="/pet/create"
            >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-container>
    
  </layout>
</template>

<script>
import axios from 'axios';
import layout from './Layout';

  export default {
  methods: {
    toPet(pet){
      this.$router.push({name: 'Pet', params: {id: pet.id}});
    }
  },
    mounted(){
        const token = localStorage.getItem('token');
        
        axios.get('http://localhost/api/pets', {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }).then(data => {
          const resData = data.data.map(arr => {
            arr.show = false;
            return arr;
          });
            this.loader = false;
          if(data){
            this.pets = resData
          }
        }).catch(err => {
          console.log(err)
        })
    },
    data: () => ({
      // items: [
      //   { id: 1, title: 'Banho Simples', src: 'https://media.gazetadopovo.com.br/viver-bem/2017/09/dognobanho-0d99ac80.jpg', amount: 30, show: false, description: 'Estamos empenhados em oferecer a vocês, nossos clientes, não apenas o melhor atendimento da região, mas um atendimento que utilize o que tem de mais moderno em tecnologia avançada em saúde, dentro dos mais rigorosos padrões de biosseguridade.' },
      //   { id: 2, title: 'Banho Completo + Tosa', src: 'https://www.filhodamae.com/img/2017/03/31/fileg_14064.jpg', amount: 50, show: false, description: 'Estamos empenhados em oferecer a vocês, nossos clientes, não apenas o melhor atendimento da região, mas um atendimento que utilize o que tem de mais moderno em tecnologia avançada em saúde, dentro dos mais rigorosos padrões de biosseguridade.'  },
      //   { id: 3, title: 'Banho Anti-alérgico', src: 'https://lh3.googleusercontent.com/proxy/oe0mCdgwy2HCWuJ3Xau-jTGuPTAnra80lOaNTRclnLmtnAZBbLBMAfeiMPE8yCeVJIrmjYYTz0Md6MqFFqwcUjtHEmoI8bfYR45mkV-wiQTPNxxK1hJCP52thMMsmKRwFdOX7h5CtcGh43BQiOI', amount: 80, show: false, description: 'Estamos empenhados em oferecer a vocês, nossos clientes, não apenas o melhor atendimento da região, mas um atendimento que utilize o que tem de mais moderno em tecnologia avançada em saúde, dentro dos mais rigorosos padrões de biosseguridade.'  },
      // ],
      loader: true,
      pets: []
    }),
    components: {
      layout
    }
    
  }
</script>