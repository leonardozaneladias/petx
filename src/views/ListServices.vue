<template>
  <layout>    
    <v-container class="blue lighten-4" :fluid="true">

      <v-skeleton-loader
      
      class="mx-auto"
      type="card"
      v-show="loader"
      v-for="i in [1,2]"
      :key="100+i"
      
    ></v-skeleton-loader>

      <v-card v-for="(item) in services" :key="item.id" 
    class="mx-auto mb-3"
    max-width="344"
  >
    <v-img
      :src="`http://localhost/${item.banner}`"
      height="150px"
    ></v-img>

    <v-card-title>
      {{item.name}}
    </v-card-title>

    <v-card-subtitle>
      R$ {{item.price}}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
        color="green lighten-2"
        text
        :to="{name: 'Agendar', params: {id: item.id}}"
      >
        AGENDAR
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        icon 
        @click="item.show = !item.show"
      >
        <v-icon>{{ item.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="item.show">
        <v-divider></v-divider>

        <v-card-text>
          {{item.description}}
          <br>
          <v-chip
            class="mt-5"
            label
            color="primary"
          >
          <v-icon left>
          mdi-clock
        </v-icon>
            Tempo Médio: {{item.average_service_time_minutes}} minutos
    </v-chip>
        </v-card-text>
      </div>
    </v-expand-transition>
    
  </v-card>
  
  
    </v-container>
  </layout>
</template>

<script>
import axios from 'axios';
import layout from './Layout';

  export default {
    mounted(){
        const token = localStorage.getItem('token');
        
        axios.get('http://localhost/api/services', {
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
            this.services = resData
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
      services: []
    }),
    components: {
      layout
    }
    
  }
</script>